/**
 * 公共环境工具模块
 * 功能：
 * 1. UA渠道拦截：微信/QQ/抖音/快手跳转拦截页
 * 2. 全局开发者工具强拦截，打开直接跳about:blank，禁止回退本页面
 * 3. 动态加载disable-devtool防调试脚本
 * 4. 自动加载两套第三方统计
 * 5. 新增：全局运行状态、DOM缓存、通用时间/随机工具
 * 文件引入后自动执行全部逻辑，无需页面手动调用
 */
const PublicEnvHelper = {
    // 统一全局配置
    config: {
        interceptRedirectUrl: "welcome.html",
        statWukong: "//api.wukongtongji.com/c?_=932732663887171584",
        statMtj: "https://node94.aizhantj.com:21233/tjjs/?k=3x3pebgp9ls",
    },

    /**
     * 1、UA渠道拦截
     */
    uaIntercept() {
        const userAgent = navigator.userAgent;
        const isWeChat = userAgent.indexOf("MicroMessenger") > -1;
        const isQQ = userAgent.indexOf("QQ/") > -1;
        const isDouyin = userAgent.indexOf('aweme') > -1 || userAgent.indexOf('bytedance') > -1;
        const isKuaishou = userAgent.indexOf('kwai') > -1;

        if (isWeChat || isQQ || isDouyin || isKuaishou) {
            window.location.href = this.config.interceptRedirectUrl;
        }
    },

    /**
     * 2、自研反调试防护（已修复手机端自动关闭bug，仅PC开启blur防抖）
     */
    loadDisableDevTool() {
        // 全局禁用右键菜单（仅PC生效，手机触屏无右键事件）
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, false);

        const self = this;
        (function antiDebug() {
            let isBlockDevTools = true;
            const startTimestamp = Date.now();
            const minScreenWidth = 170;
            const minScreenHeight = 130;
            // 移动端判断
            const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
                || window.matchMedia('(pointer:coarse)').matches;

            function checkWindowSize() {
                // 移动端返回false，不触发窗口尺寸销毁判断
                if (isMobile) return false;
                const widthDiff = Math.abs((window.outerWidth || 0) - (window.innerWidth || 0));
                const heightDiff = Math.abs((window.outerHeight || 0) - (window.innerHeight || 0));
                return widthDiff > minScreenWidth || heightDiff > minScreenHeight;
            }

            function blockDevTools() {
                // 拦截F12、Ctrl组合调试快捷键
                function keyHandler(e) {
                    const key = (e.key || '').toLowerCase();
                    const isCtrl = e.ctrlKey;
                    const isShift = e.shiftKey;
                    const isAlt = e.altKey;
                    if (
                        key === 'f12'
                        || (isCtrl && isShift && ['i', 'j', 'c'].includes(key))
                        || (isAlt && isShift && ['i', 'j', 'c'])
                    ) {
                        e.preventDefault();
                        e.stopPropagation();
                        destroyPage();
                    }
                }
                window.addEventListener('keydown', keyHandler, false);

                // 每秒轮询检测规则
                setInterval(() => {
                    const now = Date.now();
                    const timeGap = now - startTimestamp;
                    if ((!isMobile && document.hidden && timeGap > 30 * 60 * 1000) || checkWindowSize()) {
                        destroyPage();
                    }
                }, 1000);

                // 关键：仅电脑端绑定blur/focus防抖，手机完全不注册
                if (!isMobile) {
                    let blurTimer = null;
                    window.addEventListener('blur', () => {
                        clearTimeout(blurTimer);
                        blurTimer = setTimeout(() => {
                            if (document.hidden) destroyPage();
                        }, 30 * 60 * 1000);
                    });
                    window.addEventListener('focus', () => {
                        clearTimeout(blurTimer);
                    });
                }
            }

            // 销毁页面，全局标记防止重复执行
            function destroyPage() {
                if (window.__pageDestroyed) return;
                window.__pageDestroyed = true;
                isBlockDevTools = false;
                try {
                    window.open('', '_blank');
                    window.close();
                } catch (err) {}
                setTimeout(() => {
                    try {
                        window.location.replace('about:blank');
                    } catch (err) {
                        document.body.innerHTML = '';
                    }
                }, 50);
            }
            blockDevTools();
        })();
    },

    /**
     * 3、加载悟空统计
     */
    loadWukongStat() {
        const script = document.createElement("script");
        script.src = this.config.statWukong;
        script.async = true;
        document.head.appendChild(script);
    },

    /**
     * 4、加载MTJ统计
     */
    loadMtjStat() {
        window._mtj = window._mtj || [];
        const script = document.createElement("script");
        script.src = this.config.statMtj;
        const firstScript = document.getElementsByTagName("script")[0];
        firstScript.parentNode.insertBefore(script, firstScript);
    },

    /**
     * 统一初始化入口
     */
    initAll() {
        // 最高优先级：渠道UA拦截
        this.uaIntercept();
        // 启动自研反调试防护
        //this.loadDisableDevTool();
        // 加载统计脚本
        this.loadWukongStat();
        //this.loadMtjStat();
    }
};



// ====================== 以下为合并的全局状态、DOM、通用工具 ======================
// ======================================
// 【全局状态管理模块】运行时动态状态
// ======================================
const AppState = {
  bot: {
    passCount: 0,
    uploadedBase64Imgs: [],
    loadingMsgDom: null
  },
  isFirstOpenBot: true,
  carousel: {
    currentIndex: 0,
    timer: null
  },
  imageGen: {
    realW: 0,
    realH: 0,
    dpr: 1,
    OUTPUT_REAL_SIZE: { width: 0, height: 0 },
    isPosterReady: false
  }
};

// ======================================
// 【DOM缓存模块】一次性缓存DOM节点
// ======================================
const DomRefs = {};
function initDomRefs() {
  // 轮播DOM
  DomRefs.carousel = document.getElementById('invite-carousel');
  DomRefs.track = DomRefs.carousel?.querySelector('.carousel-track');
  DomRefs.slides = DomRefs.carousel?.querySelectorAll('.carousel-slide');
  DomRefs.prevBtn = DomRefs.carousel?.querySelector('.carousel-btn.prev');
  DomRefs.nextBtn = DomRefs.carousel?.querySelector('.carousel-btn.next');
  DomRefs.dotsWrap = DomRefs.carousel?.querySelector('.carousel-dots');

  // 关键词容器
  DomRefs.keywordWrap = document.getElementById("keyword-list");

  // 机器人弹窗DOM
  DomRefs.botBubble = document.getElementById('bot-bubble');
  DomRefs.botPanel = document.getElementById('bot-panel');
  DomRefs.botClose = document.getElementById('bot-close');
  DomRefs.botMessages = document.getElementById('bot-messages');
  DomRefs.botUploadBtn = document.getElementById('bot-upload-btn');
  DomRefs.botFileInput = document.getElementById('bot-file-input');

  // 图片生成模块DOM
  DomRefs.imageBox = document.getElementById('poster-wrap');
  DomRefs.posterSaveBtn = document.getElementById('poster-save-btn');

  // 底部年份
  DomRefs.yearText = document.getElementById('current-year');
}

// ======================================
// 【通用工具模块 - 时间/随机/字符串】
// ======================================
const TimeUtil = {
  sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); },
  randomSleep() {
    const { min, max } = APP_CONFIG.delayRange;
    return this.sleep(Math.floor(Math.random() * (max - min + 1)) + min);
  },
  randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  randomFloat(min, max) { return Math.random() * (max - min) + min; }
};

/**
 * 全局公共工具库
 * 首页、海报共用，消除重复代码
 */
const AppUtil = {
    // 随机整数 min-max
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // 随机浮点数
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },
    // 0~100随机百分比（首页下载按钮使用）
    getRandomPercent() {
        return Math.floor(Math.random() * 101);
    },

    // HEX转RGBA
    hexToRgba(hex, alpha) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    // 随机数字串
    getRandomNumbers(minLen, maxLen) {
        const len = this.randomNum(minLen, maxLen);
        let str = '';
        for(let i=0;i<len;i++) str += this.randomNum(0,9);
        return str;
    },
    // 随机小写字母串
    getRandomLetters(minLen, maxLen) {
        const len = this.randomNum(minLen, maxLen);
        let str = '';
        for(let i=0;i<len;i++) str += String.fromCharCode(this.randomNum(97, 122));
        return str;
    },

    // 新文件名规则：screenshot-年月日-8位随机数字
    generateRandomFileName(ext = 'jpg') {
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const dateStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
        const randomNum = this.getRandomNumbers(8,8);
        return `screenshot-${dateStr}-${randomNum}.${ext}`;
    },

    // ArrayBuffer 转二进制字符串（EXIF）
    arrayBufferToBinaryString(buffer) {
        const bytes = new Uint8Array(buffer);
        const chunkSize = 8192;
        let binary = '';
        for(let i=0;i<bytes.length;i+=chunkSize) {
            const chunk = bytes.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, chunk);
        }
        return binary;
    },

    // 二进制字符串转Blob
    binaryStringToBlob(binary, mimeType) {
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for(let i=0;i<len;i++) bytes[i] = binary.charCodeAt(i) & 0xFF;
        return new Blob([bytes], { type: mimeType });
    },

    // 生成完整EXIF数据（读取全局exifPhoneTemplates）
    generateRandomExif() {
        if(typeof piexif === 'undefined') return null;
        const templateList = APP_CONFIG.imageGen.exifPhoneTemplates;
        const template = templateList[this.randomNum(0, templateList.length - 1)];
        const now = new Date();
        const past = new Date(now.getTime() - Math.random() * 30 * 24 * 3600 * 1000);
        const pad = n => String(n).padStart(2, '0');
        const dateTime = `${past.getFullYear()}:${pad(past.getMonth()+1)}:${pad(past.getDate())} ${pad(past.getHours())}:${pad(past.getMinutes())}:${pad(past.getSeconds())}`;
        const lat = 30 + this.randomFloat(0, 10);
        const lon = 105 + this.randomFloat(0, 15);
        const fNumbers = [1.4, 1.8, 2.0, 2.8, 3.5, 5.6, 8, 11, 16];
        const fNumber = fNumbers[this.randomNum(0, fNumbers.length - 1)];
        const shutters = [8000, 4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2, 1];
        const shutterDen = shutters[this.randomNum(0, shutters.length - 1)];
        const shutterSpeed = [1, shutterDen];
        const isos = [50, 100, 200, 400, 800, 1600, 3200, 6400];
        const iso = isos[this.randomNum(0, isos.length - 1)];
        const focalLength = Math.round(this.randomFloat(24, 120));
        const focalIn35mm = Math.round(this.randomFloat(24, 150));
        const flash = [0, 1, 5, 16, 24, 25, 31, 32, 65, 69, 71, 73, 79][this.randomNum(0, 12)];
        const exposureProgram = this.randomNum(0, 4);
        const meteringMode = [1, 2, 3, 5, 6, 255][this.randomNum(0, 5)];
        const whiteBalance = Math.random() > 0.8 ? 1 : 0;

        // 固定EXIF版本字符串，替代数字数组，解决pack报错
        const exifVersion = "0231";
        // 画布固定尺寸，不要读取template.FocalLength（小数/空值）
        const outputW = APP_CONFIG.imageGen.canvasWidth || 1080;
        const outputH = APP_CONFIG.imageGen.canvasHeight || 2400;

        return {
            '0th': {
                [piexif.ImageIFD.Make]: template.Make,
                [piexif.ImageIFD.Model]: template.Model,
                [piexif.ImageIFD.Software]: template.Software,
                [piexif.ImageIFD.Copyright]: template.Copyright,
                [piexif.ImageIFD.Orientation]: template.Orientation,
                [piexif.ImageIFD.DateTime]: dateTime,
            },
            'Exif': {
                [piexif.ExifIFD.DateTimeOriginal]: dateTime,
                [piexif.ExifIFD.DateTimeDigitized]: dateTime,
                [piexif.ExifIFD.ExifVersion]: exifVersion,
                [piexif.ExifIFD.ColorSpace]: 1,
                [piexif.ExifIFD.PixelXDimension]: outputW,
                [piexif.ExifIFD.PixelYDimension]: outputH,
                [piexif.ExifIFD.FNumber]: [Math.round(fNumber * 10), 10],
                [piexif.ExifIFD.ExposureTime]: shutterSpeed,
                [piexif.ExifIFD.ISOSpeedRatings]: iso,
                [piexif.ExifIFD.FocalLength]: [focalLength, 1],

                [piexif.ExifIFD.FocalLengthIn35mmFilm]: focalIn35mm,
                [piexif.ExifIFD.Flash]: flash,
                [piexif.ExifIFD.ExposureProgram]: exposureProgram,
                [piexif.ExifIFD.MeteringMode]: meteringMode,
                [piexif.ExifIFD.WhiteBalance]: whiteBalance,
            },
            'GPS': {
                [piexif.GPSIFD.GPSVersionID]: [2, 2, 0, 0],
                [piexif.GPSIFD.GPSLatitudeRef]: 'N',
                [piexif.GPSIFD.GPSLatitude]: piexif.GPSHelper.degToDmsRational(lat),
                [piexif.GPSIFD.GPSLongitudeRef]: 'E',
                [piexif.GPSIFD.GPSLongitude]: piexif.GPSHelper.degToDmsRational(lon),
                [piexif.GPSIFD.GPSDateStamp]: `${past.getFullYear()}:${pad(past.getMonth()+1)}:${pad(past.getDate())}`,
            },
            '1st': {},
        };
    },

    // 下载触发函数
    triggerDownload(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    // 随机获取背景图地址
    getRandomBgImgUrl() {
        const list = APP_CONFIG.imageGen.bgImageList;
        return list[this.randomNum(0, list.length - 1)];
    },

    // 判断是否苹果设备（iPhone / iPod / iPad）
    isAppleDevice () {
        const ua = navigator.userAgent.toLowerCase();
        return /iphone|ipod|ipad/.test(ua);
    },

    // 判断是否 iPhone / iPod（手机）
    isIOS () {
        const ua = navigator.userAgent.toLowerCase();
        // iPad 不进入此判断
        return /iphone|ipod/.test(ua) && !/ipad/.test(ua);
    },

    // 判断是否 iPad
    isIPad () {
        const ua = navigator.userAgent.toLowerCase();
        // 兼容新版 iPadOS（桌面UA不带ipad关键词）
        const hasTouch = navigator.maxTouchPoints > 1;
        return /ipad/.test(ua) || (this.isAppleDevice() && !this.isIOS() && hasTouch);
    },

    // 判断是否 iPadOS 桌面模式（伪装Mac）
    isIPadDesktopMode () {
        const ua = navigator.userAgent;
        return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    },

    /**
     * 通用复制文本函数，全平台兼容
     * @param {string} text 需要复制的内容
     * @returns {Promise<boolean>} 复制成功返回true，失败false
     */
    copyText(text) {
        return new Promise((resolve, reject) => {
            // 1. 现代浏览器 Clipboard API 优先
            if (navigator && navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text)
                    .then(() => resolve(true))
                    .catch(() => {
                        // 权限失败，走降级方案
                        this.fallbackCopy(text).then(resolve).catch(reject);
                    });
            } else {
                // 非HTTPS/低版本浏览器直接降级
                this.fallbackCopy(text).then(resolve).catch(reject);
            }
        });
    },

    // 降级兼容方案（execCommand 兜底）
    fallbackCopy(text) {
        return new Promise((resolve, reject) => {
            // 创建临时隐藏文本框
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = text;
            // 隐藏元素，不破坏页面布局
            tempTextarea.style.position = 'fixed';
            tempTextarea.style.left = '-9999px';
            tempTextarea.style.top = '-9999px';
            tempTextarea.style.opacity = '0';
            tempTextarea.style.pointerEvents = 'none';
            document.body.appendChild(tempTextarea);

            // 选中内容
            tempTextarea.select();
            tempTextarea.setSelectionRange(0, text.length);

            try {
                // 执行复制命令
                const success = document.execCommand('copy');
                document.body.removeChild(tempTextarea);
                if (success) {
                    resolve(true);
                } else {
                    reject(new Error('复制命令执行失败'));
                }
            } catch (err) {
                document.body.removeChild(tempTextarea);
                reject(err);
            }
        });
    },
};

// 使用方式：页面DOM加载完成执行初始化
window.addEventListener('DOMContentLoaded', () => {
    PublicEnvHelper.initAll();
});