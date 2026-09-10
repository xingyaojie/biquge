// ====================== 全局统一配置 config.js ======================
const APP_CONFIG = {
    appName: "笔趣阁APP",
    appIcon: "c",

    // 邀请页面地址
    invitePageUrl: "/task",
    // 随机跳转邀请页概率 0~100
    jumpInviteRate: 70,

    downloadChannels: [
        {
            version:"3.2.6",
            visible: true,
            icon: `<svg class="download-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 128c-17.7 0-32 14.3-32 32v480L320 480c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l256 256c12.5 12.5 32.8 12.5 45.3 0l256-256c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L544 640V160c0-17.7-14.3-32-32-32zM192 832c-35.3 0-64 28.7-64 64s28.7 64 64 64h640c35.3 0 64-28.7 64-64s-28.7-64-64-64H192z"/></svg>`,
            text: "下载链接",
            desc: "iOS版「主线路」",
            link: "https://pan.quark.cn/s/6985e527a2ea"
        },
        {
            version:"3.2.6",
            visible: true,
            icon: `<svg class="download-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M192 128c-35.3 0-64 28.7-64 64v640c0 35.3 28.7 64 64 64h640c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H192zm128 192h384v64H320v-64zm0 160h384v64H320v-64zm0 160h256v64H320v-64z"/><circle cx="704" cy="544" r="96" fill="#ff7d29"/><path d="M704 496v96m-48-48h96" stroke="#fff" stroke-width="16" stroke-linecap="round"/></svg>`,
            text: "全网漫画动漫同人·点此进入",
            desc: "安卓版「主线路」",
            link: "/pages/index.html"
        },
        {
            version:"3.2.6",
            visible: true,
            icon: `<svg class="download-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M341 512c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm342 0c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96z"/><path d="M880 224H144c-53 0-96 43-96 96v480c0 53 43 96 96 96h736c53 0 96-43 96-96V320c0-53-43-96-96-96zM512 736c-159 0-256-80-256-128s53-128 96-160l-32-64c-8-16 0-35 16-43 16-8 35 0 42 18l48 96c34-16 72-23 86-23s52 7 86 23l48-96c8-16 26-26 42-18 16 8 24 27 16 43l-32 64c43 32 96 80 96 160s-97 128-256 128z"/></svg>`,
            text: "软件长期更新QQ群",
            desc: "TV版「主线路」",
            link: "https://qm.qq.com/q/lVuWSQOp2M"
        }
    ],
    platforms:[
        {
            key:'xiaohongshu',
            name:'小红书',
            icon:'https://img14.360buyimg.com/ddimg/jfs/t1/452774/35/11098/4323/6a2fa79cFbd441ffa/00150a40a42e10f5.jpg',
            webURLs:[],
            schemaURLs:[
                'xhsdiscover://search/result?keyword='
            ],
            searchKeywords:['笔趣阁纯净版','笔趣阁APP','小说神器','笔趣阁怎么下载','笔趣阁ios怎么下','苹果小说app','笔趣阁','iOS小说'],
            domains:[],
            comments:[],
            visible:true,
        },
        {
            key:'bilibili',
            name:'哔哩哔哩',
            icon:'https://img12.360buyimg.com/ddimg/jfs/t1/457061/22/5505/13730/6a2fa79cF8255ceb6/00152802802a50b7.jpg',
            webURLs:[],
            schemaURLs:[
                'bilibili://search?keyword='
            ],
            searchKeywords:['笔趣阁纯净版','笔趣阁APP','小说神器','笔趣阁怎么下载','笔趣阁ios怎么下','苹果小说app','笔趣阁','iOS小说'],
            domains:[],
            comments:[],
            visible:true,
        },
        {
            key:'douyin',
            name:'抖音',
            icon:'https://img10.360buyimg.com/ddimg/jfs/t1/446073/5/19700/9452/6a2fa79cFc9d450e4/0015280280012f86.jpg',
            webURLs:[], //跳转指定的作品,优先级最高
            schemaURLs:[
                'snssdk1128://search/result?keyword=',
                'snssdk1128://search?keyword='
            ],//跳转搜索页
            searchKeywords:['笔趣阁纯净版','笔趣阁APP','小说神器','笔趣阁怎么下载','笔趣阁ios怎么下','苹果小说app','笔趣阁','iOS小说'],//搜索关键词
            domains:[],//域名列表
            comments:[],//评论关键词
            visible:true,//是否显示
        },
        {
            key:'kuaishou',
            name:'快手',
            icon:'https://img12.360buyimg.com/ddimg/jfs/t1/448094/5/18043/11159/6a2fa79cF462cd63b/00152802804551e8.jpg',
            webURLs:[],
            schemaURLs:[
                'kwai://search?keyword=',
                'kslite://search?keyword='
            ],
            searchKeywords:['笔趣阁纯净版','笔趣阁APP','小说神器','笔趣阁怎么下载','笔趣阁ios怎么下','苹果小说app','笔趣阁','iOS小说'],
            domains:[],
            comments:[],
            visible:true,
        },


    ],
    // ========== 新增：轮播图配置 ==========
    carouselImages: [
        "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7d29"/>
      <stop offset="100%" stop-color="#d4451a"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1200" height="675" fill="url(#g1)"/>
  <circle cx="1000" cy="150" r="300" fill="rgba(255,255,255,0.08)"/>
  <circle cx="200" cy="500" r="200" fill="rgba(255,255,255,0.05)"/>
  <text x="600" y="280" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="96" font-weight="bold" fill="#ffffff" filter="url(#glow)">笔趣阁</text>
  <text x="600" y="380" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="42" fill="rgba(255,255,255,0.9)">全网热门小说 免费畅读</text>
  <text x="600" y="460" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="30" fill="rgba(255,255,255,0.7)">海量书源 · 实时更新 · 纯净无广告</text>
</svg>`),
        "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#16213e"/>
      <stop offset="100%" stop-color="#0f3460"/>
    </linearGradient>
    <filter id="glow2"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1200" height="675" fill="url(#g2)"/>
  <rect x="0" y="0" width="1200" height="675" fill="rgba(255,125,41,0.06)"/>
  <circle cx="150" cy="120" r="250" fill="rgba(255,255,255,0.03)"/>
  <circle cx="1050" cy="550" r="300" fill="rgba(255,125,41,0.08)"/>
  <text x="600" y="260" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="88" font-weight="bold" fill="#ff7d29" filter="url(#glow2)">笔趣阁 APP</text>
  <text x="600" y="370" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="40" fill="rgba(255,255,255,0.85)">离线下载 · 听书朗读 · 夜间模式</text>
  <text x="600" y="450" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="32" fill="rgba(255,255,255,0.6)">都市 · 玄幻 · 言情 · 悬疑 · 穿越 · 全部免费</text>
</svg>`),
        "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g3" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0d0d0d"/>
      <stop offset="50%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#2d1b00"/>
    </linearGradient>
    <filter id="glow3"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1200" height="675" fill="url(#g3)"/>
  <line x1="200" y1="280" x2="1000" y2="280" stroke="rgba(255,125,41,0.4)" stroke-width="1"/>
  <line x1="250" y1="400" x2="950" y2="400" stroke="rgba(255,125,41,0.2)" stroke-width="1"/>
  <text x="600" y="250" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="100" font-weight="bold" fill="#ff9d4d" filter="url(#glow3)">免费小说</text>
  <text x="600" y="370" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="44" fill="#ffffff">就用 笔趣阁</text>
  <text x="600" y="470" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="28" fill="rgba(255,255,255,0.55)">认准官网 biqug.app · 永久免费 · 永不收费</text>
</svg>`)
    ],

    keywordList: [
        { text: "笔趣阁纯净版" },
        { text: "笔趣阁APP" },
        { text: "小说神器" },
        { text: "笔趣阁怎么下载" },
        { text: "笔趣阁ios怎么下" },
        { text: "苹果小说app" },
        { text: "笔趣阁" },
        { text: "iOS小说" },

    ],
    bot: {
        needImageCount: 3,
        welcomeMsg: "你好，我是{appName} AI 审核助手。请上传 {needNum} 张你的「评论截图」（可以一次选择 {needNum} 张），每张我会在 10 秒内完成审核，{needNum} 张都通过后自动发送 {appName} 下载链接。",
        singlePassMsg: "第 {current} 张审核通过！还差 {lack} 张，请继续上传另一条评论的截图。",
        allPassMsg: "{total} 张截图全部审核通过！感谢你的支持，下面是 {appName} 的下载链接：",
        failMsg: "审核未通过：暂未识别到有效的评论截图。请直接上传手机相册里的原始截图，不要裁剪、压缩或转发后再上传。",
        repeatImgFailMsg: "审核未通过：这张截图和你之前上传的是同一张。两条评论需要分别截图，请上传另一条评论的截图。",
        storageFullTip: "本地存储空间不足，已自动清理旧聊天记录，请重新上传截图。",
        downloadTip: "点击上方下载链接即可下载安装!"
    },
    storage: {
        key: "ai_bot_chat_data",
        expireMs: 24 * 60 * 60 * 1000,
        maxSaveImgCount: 8,
        maxStorageByte: 4.5 * 1024 * 1024
    },
    imageCompress: {
        maxWidth: 400,
        quality: 0.7
    },
    delayRange: {
        min: 1000,
        max: 3000
    },
    carousel: {
        interval: 4000
    },
    auditFailRate: 0.2,
    // 图片生成统一配置（海报全部复用此节点，无独立poster配置）
    imageGen: {
        canvasWidth: 1080,
        canvasHeight: 2400,
        // 海报随机背景图集，替代原固定appImgUrl
        bgImageList: [
            "/image/615/a615-1.jpg",
            "/image/615/a615-2.jpg",
            "/image/615/a615-3.jpg",
            "/image/615/a615-4.jpg"
        ],
        // 新增海报遮罩、圆角配置
        imgRadius: 18,
        maskColorHex: '#2F3333',
        bgBlurRadius: 10,   // 底图全局模糊
        maskBlurRadius: 110, // 遮罩全局模糊
        maskOpacity: 0.6,
        textSideSafeMargin: 120,
        cropMaxOffset: 5,
        enableExif: true,
        piexifUrl: "/js/piexif.js",
        jpegQuality: 0.92,
        // 全局文字基础配置（新增文字发光参数）
        textGlobal: {
            lineHeightRatio: 2,
            letterSpacing: 1.8,
            blockHorizontalAlign: "center",
            textGlowOpacity: 0.15,
            textGlowSize: 1
        },
        // 升级textList：每条文字独立字号、颜色、字间距、行间距、字重，替代所有poster独立文字配置
        textList: [
            { content:"{date}", fontSize: 60, fontWeight: 600, color: "#ffffff", align: "center", letterSpacing: 1.8, lineSpacing: 1.8 },
            { content:"{time}", fontSize: 60, fontWeight: 600, color: "#ffffff", align: "center", letterSpacing: 1.8, lineSpacing: 2.5 },
            { content: "笔趣阁", fontSize: 52, fontWeight: 600, color: "#ffffff", align: "left", letterSpacing: 2, lineSpacing: 1.8 },
            { content: "最新版笔趣阁，白月光回归", fontSize: 52, fontWeight: 300, color: "#ffffff", align: "left", letterSpacing: 2, lineSpacing: 1.8 },
            { content: "安卓/iOS/鸿蒙/电脑/iPad", fontSize: 52, fontWeight: 300, color: "#ffffff", align: "left", letterSpacing: 1.8, lineSpacing: 1.8 },
            { content: `认准官网：biqug.at`, fontSize: 52, fontWeight: 300, color: "#ffffff", align: "left", letterSpacing: 2, lineSpacing: 1.8 }
        ],
        // 字体全局配置（原poster独立字体配置移入imageGen）
        useCustomFont: false,
        customFontUrl: '/fonts/PingFangSC-Regular.ttf',
        customFontFamily: 'CustomAustere',
        // EXIF完整机型模板，直接复用，删除poster独立phoneModels数组
        exifPhoneTemplates: [
            { Make: "Apple", Model: "iPhone 17 Pro Max", Software: "iOS 26.2", Copyright: "Shot on iPhone", LensModel: "iPhone 17 Pro Max Main Camera", FNumber: "1.78", ExposureTime: "1/33", ISOSpeedRatings: 100, FocalLength: "4.7mm", Orientation: 1 },
            { Make: "Apple", Model: "iPhone 17 Pro", Software: "iOS 26.2", Copyright: "Shot on iPhone", LensModel: "iPhone 17 Pro Wide Camera", FNumber: "1.78", ExposureTime: "1/30", ISOSpeedRatings: 120, FocalLength: "4.7mm", Orientation: 1 },
            { Make: "Apple", Model: "iPhone 16 Pro Max", Software: "iOS 18.5", Copyright: "Shot on iPhone", LensModel: "iPhone 16 Pro Max Main Camera", FNumber: "1.74", ExposureTime: "1/35", ISOSpeedRatings: 90, FocalLength: "4.5mm", Orientation: 1 },
            { Make: "Apple", Model: "iPhone 16", Software: "iOS 18.4", Copyright: "Shot on iPhone", LensModel: "iPhone 16 Wide Camera", FNumber: "1.5", ExposureTime: "1/28", ISOSpeedRatings: 150, FocalLength: "4.2mm", Orientation: 1 },
            { Make: "Apple", Model: "iPhone 15 Pro Max", Software: "iOS 18.4.1", Copyright: "Shot on iPhone", LensModel: "iPhone 15 Pro Max Main Camera", FNumber: "1.78", ExposureTime: "1/33", ISOSpeedRatings: 100, FocalLength: "4.7mm", Orientation: 1 },
            { Make: "Apple", Model: "iPhone 15", Software: "iOS 18.2", Copyright: "Shot on iPhone", LensModel: "iPhone 15 Wide Camera", FNumber: "1.5", ExposureTime: "1/24", ISOSpeedRatings: 160, FocalLength: "4.2mm", Orientation: 1 },
            { Make: "Apple", Model: "iPhone 14 Pro Max", Software: "iOS 18.2.5", Copyright: "Shot on iPhone", LensModel: "iPhone 14 Pro Max Main Camera", FNumber: "1.78", ExposureTime: "1/40", ISOSpeedRatings: 80, FocalLength: "4.7mm", Orientation: 1 },
            { Make: "HUAWEI", Model: "HUAWEI Mate 70 Pro", Software: "HarmonyOS 5.3", Copyright: "HUAWEI XMAGE", LensModel: "XMAGE Ultra Camera", FNumber: "1.4", ExposureTime: "1/20", ISOSpeedRatings: 200, FocalLength: "5.0mm", Orientation: 1 },
            { Make: "HUAWEI", Model: "HUAWEI Mate 60 Pro", Software: "HarmonyOS 5.2", Copyright: "HUAWEI XMAGE", LensModel: "XMAGE Main Camera", FNumber: "1.4", ExposureTime: "1/20", ISOSpeedRatings: 200, FocalLength: "5.0mm", Orientation: 1 },
            { Make: "HUAWEI", Model: "HUAWEI Pura 80 Pro+", Software: "HarmonyOS 6.3", Copyright: "HUAWEI XMAGE", LensModel: "XMAGE Portrait Camera", FNumber: "1.6", ExposureTime: "1/18", ISOSpeedRatings: 220, FocalLength: "4.8mm", Orientation: 1 },
            { Make: "HUAWEI", Model: "HUAWEI Pura 70 Ultra", Software: "HarmonyOS 5.2", Copyright: "HUAWEI XMAGE", LensModel: "XMAGE Ultra Camera", FNumber: "1.8", ExposureTime: "1/15", ISOSpeedRatings: 250, FocalLength: "4.6mm", Orientation: 1 },
            { Make: "HUAWEI", Model: "HUAWEI Mate X6", Software: "HarmonyOS 6.3", Copyright: "HUAWEI XMAGE", LensModel: "XMAGE Fold Camera", FNumber: "1.9", ExposureTime: "1/22", ISOSpeedRatings: 180, FocalLength: "4.9mm", Orientation: 1 },
            { Make: "Xiaomi", Model: "Xiaomi 17 Pro Max", Software: "HyperOS 2.0", Copyright: "Leica", LensModel: "Leica Summilux Lens", FNumber: "1.42", ExposureTime: "1/30", ISOSpeedRatings: 125, FocalLength: "4.9mm", Orientation: 1 },
            { Make: "Xiaomi", Model: "Xiaomi 17 Pro", Software: "HyperOS 2.0", Copyright: "Leica", LensModel: "Leica Standard Lens", FNumber: "1.46", ExposureTime: "1/28", ISOSpeedRatings: 140, FocalLength: "4.8mm", Orientation: 1 },
            { Make: "Xiaomi", Model: "Xiaomi 14 Ultra", Software: "HyperOS 1.0", Copyright: "Leica", LensModel: "Leica Summilux Lens", FNumber: "1.42", ExposureTime: "1/30", ISOSpeedRatings: 125, FocalLength: "4.9mm", Orientation: 1 },
            { Make: "Redmi", Model: "Redmi K80 Ultra", Software: "HyperOS 1.0", Copyright: "Redmi Camera", LensModel: "Redmi Main Camera", FNumber: "1.6", ExposureTime: "1/25", ISOSpeedRatings: 160, FocalLength: "4.5mm", Orientation: 1 },
            { Make: "vivo", Model: "vivo X300 Pro", Software: "OriginOS 5", Copyright: "ZEISS", LensModel: "ZEISS Telephoto Lens", FNumber: "1.5", ExposureTime: "1/26", ISOSpeedRatings: 150, FocalLength: "4.3mm", Orientation: 1 },
            { Make: "vivo", Model: "vivo X200 Pro", Software: "OriginOS 4", Copyright: "ZEISS", LensModel: "ZEISS Main Camera", FNumber: "1.57", ExposureTime: "1/24", ISOSpeedRatings: 170, FocalLength: "4.4mm", Orientation: 1 },
            { Make: "vivo", Model: "vivo S50 Pro", Software: "OriginOS 4", Copyright: "vivo Camera", LensModel: "vivo Portrait Camera", FNumber: "1.8", ExposureTime: "1/22", ISOSpeedRatings: 190, FocalLength: "4.6mm", Orientation: 1 },
            { Make: "iQOO", Model: "iQOO 15 Pro", Software: "OriginOS 5", Copyright: "iQOO Gaming Camera", LensModel: "iQOO Wide Camera", FNumber: "1.6", ExposureTime: "1/32", ISOSpeedRatings: 110, FocalLength: "4.2mm", Orientation: 1 },
            { Make: "iQOO", Model: "iQOO Z9 Turbo", Software: "OriginOS 4", Copyright: "iQOO Camera", LensModel: "iQOO Daily Camera", FNumber: "1.9", ExposureTime: "1/20", ISOSpeedRatings: 210, FocalLength: "4.8mm", Orientation: 1 },
            { Make: "OPPO", Model: "OPPO Find X8 Ultra", Software: "ColorOS 15", Copyright: "OPPO Hasselblad", LensModel: "Hasselblad Main Lens", FNumber: "1.4", ExposureTime: "1/29", ISOSpeedRatings: 130, FocalLength: "4.8mm", Orientation: 1 },
            { Make: "OPPO", Model: "OPPO Find X7", Software: "ColorOS 14", Copyright: "OPPO Hasselblad", LensModel: "Hasselblad Standard Lens", FNumber: "1.56", ExposureTime: "1/27", ISOSpeedRatings: 145, FocalLength: "4.7mm", Orientation: 1 },
            { Make: "OnePlus", Model: "OnePlus 15", Software: "ColorOS 15", Copyright: "OnePlus Camera", LensModel: "OnePlus Wide Camera", FNumber: "1.5", ExposureTime: "1/28", ISOSpeedRatings: 135, FocalLength: "4.3mm", Orientation: 1 },
            { Make: "OnePlus", Model: "OnePlus Ace 6", Software: "ColorOS 14", Copyright: "OnePlus Camera", LensModel: "OnePlus Daily Lens", FNumber: "1.7", ExposureTime: "1/21", ISOSpeedRatings: 195, FocalLength: "4.5mm", Orientation: 1 },
            { Make: "realme", Model: "realme GT8 Pro", Software: "realme UI 5", Copyright: "realme Camera", LensModel: "realme Main Camera", FNumber: "1.65", ExposureTime: "1/23", ISOSpeedRatings: 180, FocalLength: "4.4mm", Orientation: 1 },
            { Make: "SAMSUNG", Model: "Galaxy S26 Ultra", Software: "One UI 7.1", Copyright: "SAMSUNG Camera", LensModel: "Wide-angle Camera", FNumber: "1.5", ExposureTime: "1/26", ISOSpeedRatings: 150, FocalLength: "4.3mm", Orientation: 1 },
            { Make: "SAMSUNG", Model: "Galaxy S26+", Software: "One UI 7.0", Copyright: "SAMSUNG Camera", LensModel: "Main Camera", FNumber: "1.6", ExposureTime: "1/25", ISOSpeedRatings: 165, FocalLength: "4.4mm", Orientation: 1 },
            { Make: "SAMSUNG", Model: "Galaxy S24 Ultra", Software: "One UI 6.1", Copyright: "SAMSUNG Camera", LensModel: "Wide-angle Camera", FNumber: "1.5", ExposureTime: "1/26", ISOSpeedRatings: 150, FocalLength: "4.3mm", Orientation: 1 },
            { Make: "SAMSUNG", Model: "Galaxy Z Fold5", Software: "One UI 6.0", Copyright: "SAMSUNG Fold", LensModel: "Fold Main Camera", FNumber: "1.8", ExposureTime: "1/22", ISOSpeedRatings: 175, FocalLength: "4.6mm", Orientation: 1 },
            { Make: "HONOR", Model: "HONOR Magic7 Pro", Software: "MagicOS 9.0", Copyright: "HONOR Eagle", LensModel: "Eagle Main Camera", FNumber: "1.45", ExposureTime: "1/27", ISOSpeedRatings: 140, FocalLength: "4.7mm", Orientation: 1 },
            { Make: "HONOR", Model: "HONOR X70", Software: "MagicOS 8.0", Copyright: "HONOR Camera", LensModel: "Daily Camera", FNumber: "1.85", ExposureTime: "1/19", ISOSpeedRatings: 220, FocalLength: "4.9mm", Orientation: 1 }
        ]
    }
};

// 全局占位符替换工具（依赖APP_CONFIG）
const TextReplaceUtil = {
    replace(str) {
        if (typeof str !== "string") return str;
        return str.replaceAll("{appName}", APP_CONFIG.appName);
    },
    replaceObj(obj) {
        const name = APP_CONFIG.appName;
        for (const key in obj) {
            const val = obj[key];
            if (typeof val === "string") {
                obj[key] = val.replaceAll("{appName}", name);
            } else if (Array.isArray(val)) {
                obj[key] = val.map(item => {
                    if (typeof item === "string") return item.replaceAll("{appName}", name);
                    if (item && typeof item === "object") this.replaceObj(item);
                    return item;
                })
            } else if (val && typeof val === "object") {
                this.replaceObj(val);
            }
        }
    },
    /**
     * 【新增】自定义占位符替换（通用方法）
     * @param {string} str 原始字符串
     * @param {string} placeholder 要替换的占位符（例：{version}、{tips}）
     * @param {string} target 替换后的目标文本
     * @returns {string} 替换完成的新字符串
     */
    replaceAll(str, placeholder, target) {
        if (typeof str !== "string") return str;
        if (!placeholder) return str;
        return str.replaceAll(placeholder, target);
    }
};