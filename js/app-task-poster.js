/**
 * 海报生成引擎 (像素级重写)
 *
 * 完全复刻原站 Canvas 合成管线（1080×2400）：
 *  1. 随机背景图 → 填充满画布 + 随机微偏移 + 高斯模糊
 *  2. 遮罩层（maskColorHex + maskOpacity + maskBlur）
 *  3. 底部渐变加深区（从 25% 高度开始）
 *  4. 逐行文字渲染（含逐字 letter-spacing、textGlow 发光、blockHorizontalAlign 块居中）
 *  5. JPEG 导出 + 随机 EXIF 注入
 */

const PosterEngine = (() => {
    /* ---------- 内部状态 ---------- */
    const state = {
        bgImg: null,
        fontReady: false,
        exifOk: false,
        ready: false,
        blob: null
    };

    /* ================================================================
     *  工具函数
     * ================================================================ */

    /** 中文日期 */
    function dateStr() {
        const d = new Date();
        return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }
    /** HH:MM:SS (北京时间) */
    function timeStr() {
        const d = new Date();
        return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
    }
    /** 占位符替换 */
    function fill(str) {
        return str.replace('{date}', dateStr()).replace('{time}', timeStr());
    }

    /* 加载图片 */
    function loadImg(src) {
        return new Promise((ok, fail) => {
            const i = new Image();
            i.crossOrigin = 'anonymous';
            i.onload = () => ok(i);
            i.onerror = () => fail(new Error('load fail: ' + src));
            i.src = src;
        });
    }

    /* ================================================================
     *  文字宽度计算（Canvas measureText + 手动 letter-spacing）
     * ================================================================ */
    function measureWidth(ctx, text, fontSize, fontWeight, letterSpacing, fontFamily) {
        if (!text || !text.length) return 0;
        ctx.font = fontWeight + ' ' + fontSize + 'px ' + fontFamily;
        let w = 0;
        for (let i = 0; i < text.length; i++) {
            w += ctx.measureText(text[i]).width;
            if (i < text.length - 1) w += letterSpacing;
        }
        return w;
    }

    /* ================================================================
     *  逐字绘制（支持 letter-spacing）
     * ================================================================ */
    function fillTextWithSpacing(ctx, text, x, y, letterSpacing) {
        if (!text || !text.length) return;
        let curX = x;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            ctx.fillText(ch, curX, y);
            curX += ctx.measureText(ch).width + letterSpacing;
        }
    }

    /* ================================================================
     *  主渲染
     * ================================================================ */
    async function generate() {
        const C = APP_CONFIG.imageGen;
        const W = C.canvasWidth;   // 1080
        const H = C.canvasHeight;  // 2400

        /* ---- canvas ---- */
        const cv = document.createElement('canvas');
        cv.width = W;
        cv.height = H;
        const ctx = cv.getContext('2d');

        /* ---- 第1层：背景图 ---- */
        const bgUrl = AppUtil.getRandomBgImgUrl();
        let bgImg;
        try {
            bgImg = await loadImg(bgUrl);
            state.bgImg = bgImg;
        } catch (e) {
            console.warn('bg load fail, solid fallback', e);
            ctx.fillStyle = C.maskColorHex;
            ctx.fillRect(0, 0, W, H);
            return finalize(cv);
        }

        const scale = Math.max(W / bgImg.width, H / bgImg.height);
        const bw = bgImg.width * scale;
        const bh = bgImg.height * scale;
        const bx = (W - bw) / 2 + (Math.random() - 0.5) * C.cropMaxOffset * 2;
        const by = (H - bh) / 2 + (Math.random() - 0.5) * C.cropMaxOffset * 2;

        if (C.bgBlurRadius > 0) ctx.filter = 'blur(' + C.bgBlurRadius + 'px)';
        ctx.drawImage(bgImg, bx, by, bw, bh);
        ctx.filter = 'none';

        /* ---- 第2层：遮罩 ---- */
        const maskCv = document.createElement('canvas');
        maskCv.width = W;
        maskCv.height = H;
        const maskCtx = maskCv.getContext('2d');
        maskCtx.fillStyle = C.maskColorHex;
        maskCtx.fillRect(0, 0, W, H);

        if (C.maskBlurRadius > 0) ctx.filter = 'blur(' + C.maskBlurRadius + 'px)';
        ctx.globalAlpha = C.maskOpacity;
        ctx.drawImage(maskCv, 0, 0);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;

        /* ---- 第3层：底部渐变暗角 ---- */
        const gradTop = H * 0.25;
        const grad = ctx.createLinearGradient(0, gradTop, 0, H);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, gradTop, W, H - gradTop);

        /* ---- 第4层：文字 ---- */
        await renderText(ctx, C);

        return finalize(cv);
    }

    /* ================================================================
     *  文字渲染（核心 —— 完全复刻原站）
     *
     *  原站逻辑：将 textList 按 align 拆为两组——
     *    居中组（日期/时间）→ 画布上半部分
     *    左对齐组（品牌文案）→ 画布中间偏下
     *  两组之间由 lineHeightRatio 控制间距。
     * ================================================================ */
    async function renderText(ctx, C) {
        const list = C.textList;
        const g = C.textGlobal;
        const W = C.canvasWidth;
        const H = C.canvasHeight;
        const M = C.textSideSafeMargin;          // 120
        const lhRatio = g.lineHeightRatio || 2;

        /* -- 字体 -- */
        let ff = "'PingFang SC','Microsoft YaHei',sans-serif";
        if (C.useCustomFont && C.customFontUrl) {
            try {
                const font = new FontFace(C.customFontFamily, 'url(' + C.customFontUrl + ')');
                const lf = await font.load();
                document.fonts.add(lf);
                state.fontReady = true;
                ff = "'" + C.customFontFamily + "'," + ff;
            } catch (e) { /* fallback */ }
        }

        /* -- 拆分为 居中组 和 左对齐组 -- */
        const centerGroup = [];   // align === 'center'
        const leftGroup = [];     // align === 'left' 或其它
        list.forEach((item, i) => {
            if (item.align === 'center') centerGroup.push({ ...item, _idx: i });
            else leftGroup.push({ ...item, _idx: i });
        });

        /* 辅助：计算一组文字的总高度 */
        function groupHeight(group) {
            let h = 0;
            group.forEach(item => {
                h += (item.fontSize || 40) * (item.lineSpacing || 1.8);
            });
            return h;
        }

        /* 辅助：计算一组文字的最大宽度 */
        function groupMaxW(group) {
            let mw = 0;
            group.forEach(item => {
                const fs = item.fontSize || 40;
                const fw = item.fontWeight || 300;
                const ls = item.letterSpacing || 1.8;
                const txt = fill(item.content);
                const w = measureWidth(ctx, txt, fs, fw, ls, ff);
                if (w > mw) mw = w;
            });
            return mw;
        }

        /* 辅助：绘制一组文字 */
        function drawGroup(group, startY, blockX, maxW) {
            let curY = startY;
            group.forEach(item => {
                const txt = fill(item.content);
                const fs = item.fontSize || 40;
                const fw = item.fontWeight || 300;
                const color = item.color || '#ffffff';
                const align = item.align || 'left';
                const ls = item.letterSpacing || 1.8;
                const lh = fs * (item.lineSpacing || 1.8);

                ctx.font = fw + ' ' + fs + 'px ' + ff;
                ctx.fillStyle = color;
                ctx.textBaseline = 'top';

                if (g.textGlowOpacity > 0) {
                    ctx.shadowColor = 'rgba(0,0,0,' + g.textGlowOpacity + ')';
                    ctx.shadowBlur = g.textGlowSize;
                }

                if (align === 'center') {
                    ctx.textAlign = 'center';
                    ctx.fillText(txt, W / 2, curY);
                } else {
                    ctx.textAlign = 'left';
                    fillTextWithSpacing(ctx, txt, blockX, curY, ls);
                }

                curY += lh;

                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            });
            return curY; // 返回绘制后的 Y
        }

        /* ======== 定位计算 ======== */

        const centerH = groupHeight(centerGroup);   // 居中组高度
        const leftH = groupHeight(leftGroup);       // 左对齐组高度
        const leftMaxW = groupMaxW(leftGroup);      // 左对齐组最大宽度

        // 左对齐组块居左（左边距减半）
        const blockX = (W - leftMaxW) / 4;

        // 两组之间的额外间距 = 居中组高度 × (lineHeightRatio - 1) / 8
        const gapBetween = centerH * (lhRatio - 1) / 8;

        // 总高度：居中组 + 间距 + 左对齐组
        const totalBlockH = centerH + gapBetween + leftH;

        // 整块垂直居中
        const blockStartY = (H - totalBlockH) / 2;

        // 居中组起始 Y
        const centerStartY = blockStartY;

        // 左对齐组起始 Y = 居中组底部 + 间距
        const leftStartY = centerStartY + centerH + gapBetween;

        /* ======== 绘制 ======== */
        drawGroup(centerGroup, centerStartY, blockX, 0);
        drawGroup(leftGroup, leftStartY, blockX, leftMaxW);
    }

    /* ================================================================
     *  输出：JPEG + EXIF + 插入 DOM
     * ================================================================ */
    async function finalize(cv) {
        const C = APP_CONFIG.imageGen;
        const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', C.jpegQuality));
        let out = blob;

        /* EXIF */
        if (C.enableExif && typeof piexif !== 'undefined') {
            try {
                const ab = await blob.arrayBuffer();
                const bin = AppUtil.arrayBufferToBinaryString(ab);
                const exif = AppUtil.generateRandomExif();
                if (exif) {
                    const exifBin = piexif.dump(exif);
                    const newBin = piexif.insert(exifBin, bin);
                    out = AppUtil.binaryStringToBlob(newBin, 'image/jpeg');
                }
            } catch (e) { console.warn('exif fail', e); }
        }

        state.blob = out;
        state.ready = true;
        AppState.imageGen.isPosterReady = true;
        insertDOM(out);
        return out;
    }

    function insertDOM(blob) {
        const box = DomRefs.imageBox;
        if (!box) return;
        const loading = document.getElementById('poster-loading');
        if (loading) loading.remove();

        let img = document.getElementById('downloadableImage');
        if (!img) {
            img = document.createElement('img');
            img.id = 'downloadableImage';
            img.alt = '宣传海报';
            box.appendChild(img);
        }
        img.src = URL.createObjectURL(blob);

        const btn = DomRefs.posterSaveBtn;
        if (btn) {
            btn.style.display = 'flex';
            btn.disabled = false;
        }
        bindSave(blob);
    }

    function bindSave(blob) {
        const btn = DomRefs.posterSaveBtn;
        if (!btn || btn.__b) return;
        btn.__b = true;
        btn.addEventListener('click', () => {
            AppUtil.triggerDownload(blob, AppUtil.generateRandomFileName('jpg'));
        });
    }

    /* ================================================================
     *  入口
     * ================================================================ */
    async function init() {
        try {
            if (APP_CONFIG.imageGen.enableExif && typeof piexif === 'undefined') {
                await new Promise((ok) => {
                    const s = document.createElement('script');
                    s.src = APP_CONFIG.imageGen.piexifUrl;
                    s.onload = () => { state.exifOk = true; ok(); };
                    s.onerror = () => { console.warn('piexif load fail'); ok(); };
                    document.head.appendChild(s);
                });
            }
            await generate();
            console.log('poster ready');
        } catch (e) {
            console.error('poster fail', e);
            const el = document.getElementById('poster-loading');
            if (el) el.textContent = '海报生成失败，请刷新重试';
        }
    }

    return { init };
})();

window.addEventListener('load', () => {
    setTimeout(() => {
        if (document.getElementById('poster-wrap')) PosterEngine.init();
    }, 300);
});