const TaskTemplateHelper ={
    // 完整body内部HTML模板（轮播改为动态容器，移除硬编码图片）
    TaskPageHtmlTemplate : `
    <main class="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <!-- 顶部介绍区域 -->
        <section class="invite-intro-section">
            <div class="invite-intro-card">
                <h1 class="invite-intro-title">
                    免费小说，用<span>{appName}</span>
                </h1>
                <p class="invite-intro-text">
                    {appName}，全网热门小说免费看，海量书源实时更新，随时随地畅享阅读乐趣。
                </p>
                <p class="invite-intro-text">
                    但我们承诺<strong>永不向用户收费</strong>。为了让更多喜欢看书的小伙伴用上{appName}，请您花30秒帮我们推广一下。
                </p>
                <p class="invite-intro-text">
                    即可免费全部功能，包括不限于：离线下载、听书朗读、夜间模式、无广告阅读等。
                </p>
            </div>
        </section>

        <!-- 轮播区域 -->
        <section class="carousel-section">
            <div class="carousel-container">
                <div class="carousel" id="invite-carousel">
                    <div class="carousel-track">
                        <!-- 轮播图片由JS动态生成 -->
                    </div>
                    <button type="button" class="carousel-btn prev" aria-label="上一张">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button type="button" class="carousel-btn next" aria-label="下一张">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                    <div class="carousel-dots" role="tablist" aria-label="轮播指示器"></div>
                </div>
            </div>
        </section>

        <!-- 参与步骤区域 -->
        <section class="steps-section pb-16 px-4">
            <h2 class="steps-heading">参与步骤</h2>
            <div class="steps-list">
                <!-- 第一步 -->
                <div class="step-card">
                    <div class="flex items-start gap-4">
                        <div class="flex-1">
                            <h3 class="step-title">第一步：保存海报</h3>
                            <p class="step-intro">
                                <!-- 海报下载提示由JS动态生成 -->

                            </p>
                            <div class="poster-wrap" id="poster-wrap">
                                <div class="poster-loading" id="poster-loading">宣传海报生成中…</div>
                            </div>
                            <button type="button" id="poster-save-btn" disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                保存海报

                            </button>
                            <!-- 提示文字单独在外层，不包含按钮 -->
                            <div class="poster-actions flex flex-col items-center gap-3">
                                <p>移动端可长按海报图直接保存</p>
                            </div>

                        </div>

                    </div>
                </div>

                <!-- 第二步 -->
                <div class="step-card">
                    <div class="flex items-start gap-4">
                        <div class="flex-1">
                            <h3 class="step-title">第二步：打开自媒体平台</h3>
                            <p class="step-intro">
                                <strong>点击下方平台图标</strong>，将自动跳转到对应APP ↓↓
                            </p>
                            <div class="platforms-container" id="platformsContainer">
                                <!-- 推广平台由JS动态生成 -->
                            </div>
                            <!--
                            <div class="keyword-list" id="keyword-list"></div>
                            -->
                            <p class="step-note">
                                或去对应的平台搜想看的影视动漫，相关的视频/图文都可以评论
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 第三步 -->
                <div class="step-card">
                    <div class="flex items-start gap-4">
                        <div class="flex-1">
                            <h3 class="step-title">第三步：评论并截图</h3>
                            <p class="step-intro">
                                至少对你搜索的 <span class="step-highlight">{needNum}条作品</span>
                                进行评论，评论内容为第一步保存的{appName}截图。最后给自己点个赞，并将自己的评论内容截图！
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 第四步 -->
                <div class="step-card">
                    <div class="flex items-start gap-4">
                        <div class="flex-1">
                            <h3 class="step-title">第四步：发送截图给 AI机器人</h3>
                            <p class="step-intro">
                                将你刚评论的截图发给<span class="step-highlight">右下侧的
                                    AI机器人</span>，机器人会在（10）秒内审核完，然后会在聊天框自动弹出{appName}下载链接
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 页脚 -->
        <footer>
            <p>© <span id="current-year"></span> {appName}. All rights reserved.</p>
        </footer>
    </main>

    <div class="toast"></div>

    <!-- AI 审核机器人悬浮按钮 -->
    <button type="button" class="bot-bubble" id="bot-bubble" aria-label="打开 AI 审核机器人">
        <svg class="icon" width="200" height="200" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M617 184H407c-22 0-39-17-39-39V68C368 31 398 0 435 0h155c37 0 67 31 67 68v76c0 22-17 40-40 40zM446 105h131V79H446v26z"/><path fill="#fff" d="M880 1024H144c-22 0-39-17-39-39V852c0-53 45-96 99-96h149v-86c0-22 17-39 39-39h239c22 0 39 17 39 39v86h148c55 0 99 43 99 96v133c1 22-17 39-39 39zM184 945h656v-94c0-10-9-17-21-17H661c-38 0-70-30-70-68v-57H432v57c0 37-31 68-70 68H205c-11 0-21 8-21 17v94z"/><path fill="#fff" d="M771 709H254c-53 0-96-45-96-100V205c0-55 43-100 96-100h517c53 0 96 45 96 100v404c-1 55-43 100-96 100zM254 184c-9 0-17 10-17 22v404c0 12 8 22 17 22h517c9 0 17-10 17-22V205c0-12-8-22-17-22H254z"/><path fill="#fff" d="M66 499c-22 0-39-17-39-39V302c0-22 17-39 39-39s39 17 39 39v158c0 22-17 39-39 39zm892 0c-22 0-39-17-39-39V302c0-22 17-39 39-39s39 17 39 39v158c0 22-18 39-39 39z"/><path fill="#fff" d="M407 354c0 29-24 53-53 53s-53-24-53-53 24-53 53-53 53 24 53 53zm315 0c0 29-24 53-53 53s-53-24-53-53 24-53 53-53 53 24 53 53z"/></svg>
    </button>

    <div class="bot-panel" id="bot-panel" role="dialog" aria-label="AI 审核机器人">
        <div class="bot-header">
            <div class="bot-avatar">
                <svg class="icon" width="200" height="200" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M617 184H407c-22 0-39-17-39-39V68C368 31 398 0 435 0h155c37 0 67 31 67 68v76c0 22-17 40-40 40zM446 105h131V79H446v26z"/><path fill="#fff" d="M880 1024H144c-22 0-39-17-39-39V852c0-53 45-96 99-96h149v-86c0-22 17-39 39-39h239c22 0 39 17 39 39v86h148c55 0 99 43 99 96v133c1 22-17 39-39 39zM184 945h656v-94c0-10-9-17-21-17H661c-38 0-70-30-70-68v-57H432v57c0 37-31 68-70 68H205c-11 0-21 8-21 17v94z"/><path fill="#fff" d="M771 709H254c-53 0-96-45-96-100V205c0-55 43-100 96-100h517c53 0 96 45 96 100v404c-1 55-43 100-96 100zM254 184c-9 0-17 10-17 22v404c0 12 8 22 17 22h517c9 0 17-10 17-22V205c0-12-8-22-17-22H254z"/><path fill="#fff" d="M66 499c-22 0-39-17-39-39V302c0-22 17-39 39-39s39 17 39 39v158c0 22-17 39-39 39zm892 0c-22 0-39-17-39-39V302c0-22 17-39 39-39s39 17 39 39v158c0 22-18 39-39 39z"/><path fill="#fff" d="M407 354c0 29-24 53-53 53s-53-24-53-53 24-53 53-53 53 24 53 53zm315 0c0 29-24 53-53 53s-53-24-53-53 24-53 53-53 53 24 53 53z"/></svg>
            </div>
            <div class="bot-header-info">
                <div class="bot-name">{appName} AI 审核助手</div>
                <div class="bot-status">在线</div>
            </div>
            <button type="button" class="bot-close" id="bot-close" aria-label="关闭">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="bot-messages" id="bot-messages"></div>
        <div class="bot-footer">
            <button type="button" class="bot-upload-btn" id="bot-upload-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                上传评论截图
            </button>
            <input type="file" id="bot-file-input" accept="image/*" multiple style="display: none;" />
        </div>
    </div>
    `,

    /**
     * 动态生成轮播图片HTML
     */
    buildCarouselHtml() {
        let html = '';
        APP_CONFIG.carouselImages.forEach((imgUrl, index) => {
            const loadingAttr = index > 0 ? ' loading="lazy"' : '';
            html += `<div class="carousel-slide">
                <img src="${imgUrl}" alt="邀请活动图片 ${index + 1}"${loadingAttr} />
            </div>`;
        });
        return html;
    },

    encodeKeyword(keyword) {
        return encodeURIComponent(keyword || '');
    },

    showToast(message) {
        const toast = document.querySelector('.toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    },

    getPlatformByKey(key = ""){
        if(!APP_CONFIG.platforms || !key){
            return {};
        }
        const target = APP_CONFIG.platforms.find(p => p.key === key && p.visible === true);
        return target || {};
    },

    // 平台跳转
    async handlePlatformClick(key) {
        const platform = this.getPlatformByKey(key)
        if (!Object.keys(platform).length) return this.showToast('未找到该平台配置');
        const keyword = platform.searchKeywords[AppUtil.randomNum(0, platform.searchKeywords.length - 1)];
        const encoded = this.encodeKeyword(keyword);
        await AppUtil.copyText(keyword);
        try {
            if (platform.webURLs && platform.webURLs.length > 0) {
                const targetUrl = platform.webURLs[AppUtil.randomNum(0, platform.webURLs.length - 1)];
                window.location.href = targetUrl;
                this.showToast(`✓ 正在打开${platform.name}`);
                return;
            }

            if (platform.schemaURLs && platform.schemaURLs.length > 0) {
                for (const schema of platform.schemaURLs) {
                    window.location.href = schema + encoded;
                    await new Promise(r => setTimeout(r, 600));
                }
                await AppUtil.copyText(keyword);
                this.showToast(`⚠ ${platform.name}无法自动打开，搜索关键词已复制，请手动打开APP进行搜索。`);
            } else {
                this.showToast(`⚠ ${platform.name}暂无跳转链接，搜索关键词已复制，请手动打开APP进行搜索。`);
            }
        } catch (e) {
            console.error('平台跳转失败:', e);
            this.showToast('⚠ 跳转失败，搜索关键词已复制，请手动打开APP进行搜索。');
        }
    },

    // 渲染平台
    buildPlatformsHtml() {
        if (!APP_CONFIG.platforms) return "";
        const visiblePlatforms = APP_CONFIG.platforms.filter(p => p.visible === true);
        let html = "";
        visiblePlatforms.forEach(platform => {
            html += `<div class="platform-btn-large" data-platform-key="${platform.key}">
                        <div class="icon">
                            <img src="${platform.icon}" alt="${platform.name}">
                        </div>
                        <span class="name">${platform.name}</span>
                    </div>`;
        });
        return html;
    },

    // 页面渲染入口：统一处理 title、icon、{appName} 占位符
    renderTaskHtml() {
        TextReplaceUtil.replaceObj(APP_CONFIG);
        document.title = `${APP_CONFIG.appName} - 邀请有礼`;

        const faviconLink = document.querySelector('link[rel="icon"]');
        const appleIconLink = document.querySelector('link[rel="apple-touch-icon"]');
        if (faviconLink) faviconLink.href = APP_CONFIG.appIcon;
        if (appleIconLink) appleIconLink.href = APP_CONFIG.appIcon;

        let pageHtml = TextReplaceUtil.replace(this.TaskPageHtmlTemplate)
                            .replaceAll("{needNum}",APP_CONFIG.bot.needImageCount);

        // 动态填充年份
        const nowYear = new Date().getFullYear();
        pageHtml = pageHtml.replace('id="current-year"', `id="current-year">${nowYear}`);

        const carouselHtml = this.buildCarouselHtml();
        const platformHtml = this.buildPlatformsHtml();
        const saveImageTip = AppUtil.isIOS() || AppUtil.isIPad() ? '长按海报保存到您的相册' : '长按或点击下方按钮保存海报到您的相册';
        pageHtml = pageHtml.replace(
            '<!-- 轮播图片由JS动态生成 -->',
            carouselHtml
        ).replace(
            '<!-- 推广平台由JS动态生成 -->',
            platformHtml
        ).replace(
            '<!-- 海报下载提示由JS动态生成 -->',
            saveImageTip
        );

        document.getElementById("app-root").innerHTML = pageHtml;

        // ========== 绑定平台点击事件 ==========
        const container = document.getElementById('platformsContainer');
        if (container) {
            container.addEventListener('click', async (e) => {
                const targetBtn = e.target.closest('.platform-btn-large');
                if (!targetBtn) return;
                const key = targetBtn.dataset.platformKey;
                await TaskTemplateHelper.handlePlatformClick(key);
            })
        }

    },

    initTemplate: function(){
        this.renderTaskHtml();
    }
};