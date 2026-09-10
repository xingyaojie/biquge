// ======================================
// 【工具模块1：本地存储（机器人聊天缓存）】
// ======================================
const StorageUtil = {
  getAllImgBase64() {
    const imgs = DomRefs.botMessages?.querySelectorAll("img") || [];
    const list = [];
    imgs.forEach(img => {
      const src = img.getAttribute("src");
      if (src.startsWith("data:image/")) list.push(src);
    });
    return list;
  },
  cleanOldestImageMsg() {
    const allMsg = Array.from(DomRefs.botMessages?.querySelectorAll(".bot-msg") || []);
    for (const msg of allMsg) {
      if (msg.querySelector("img")) {
        msg.remove();
        AppState.bot.uploadedBase64Imgs = this.getAllImgBase64();
        return true;
      }
    }
    this.clearAllData();
    return false;
  },
  safeSave(dataObj) {
    try {
      const json = JSON.stringify(dataObj);
      if (new Blob([json]).size > APP_CONFIG.storage.maxStorageByte) {
        this.cleanOldestImageMsg();
        return false;
      }
      localStorage.setItem(APP_CONFIG.storage.key, json);
      return true;
    } catch (err) {
      if (err.name === "QuotaExceededError") this.cleanOldestImageMsg();
      console.error("存储写入异常：", err);
      return false;
    }
  },
  saveChat() {
    AppState.bot.uploadedBase64Imgs = this.getAllImgBase64();
    while (AppState.bot.uploadedBase64Imgs.length > APP_CONFIG.storage.maxSaveImgCount) {
      this.cleanOldestImageMsg();
    }
    const msgNodes = Array.from(DomRefs.botMessages?.querySelectorAll(".bot-msg") || []);
    const chatRecords = msgNodes.map(node => ({ className: node.className, innerHTML: node.innerHTML }));
    const storeData = {
      chatRecords,
      passCount: AppState.bot.passCount,
      uploadedBase64Imgs: AppState.bot.uploadedBase64Imgs,
      isFirstOpenBot: AppState.isFirstOpenBot,
      saveTime: Date.now()
    };
    const saveOk = this.safeSave(storeData);
    if (!saveOk) MsgUtil.sendBotDirect(APP_CONFIG.bot.storageFullTip);
  },
  clearAllData() {
    localStorage.removeItem(APP_CONFIG.storage.key);
    if (DomRefs.botMessages) DomRefs.botMessages.innerHTML = "";
    AppState.bot.passCount = 0;
    AppState.bot.uploadedBase64Imgs = [];
    AppState.isFirstOpenBot = true;
  },
  loadChat() {
    const str = localStorage.getItem(APP_CONFIG.storage.key);
    if (!str) return;
    try {
      const data = JSON.parse(str);
      const now = Date.now();
      if (now - data.saveTime > APP_CONFIG.storage.expireMs) {
        this.clearAllData();
        console.log("聊天缓存过期自动清空");
        return;
      }
      AppState.bot.passCount = data.passCount || 0;
      AppState.bot.uploadedBase64Imgs = data.uploadedBase64Imgs || [];
      AppState.isFirstOpenBot = data.isFirstOpenBot ?? true;
      if (DomRefs.botMessages) DomRefs.botMessages.innerHTML = "";
      if (Array.isArray(data.chatRecords) && DomRefs.botMessages) {
        data.chatRecords.forEach(record => {
          const div = document.createElement("div");
          div.className = record.className;
          div.innerHTML = record.innerHTML;
          DomRefs.botMessages.appendChild(div);
        });
      }
      AppState.bot.uploadedBase64Imgs = this.getAllImgBase64();
      MsgUtil.scrollBottom();
    } catch (err) {
      this.clearAllData();
      console.log("聊天缓存损坏重置");
    }
  }
};

// ======================================
// 【工具模块2：聊天消息管理】
// ======================================
const MsgUtil = {
  async sendBot(html) {
    this.showLoading();
    this.scrollBottom();
    await TimeUtil.randomSleep();
    this.hideLoading();
    this.sendBotDirect(html);
  },
  sendBotDirect(html) {
    const div = document.createElement("div");
    div.className = "bot-msg from-bot";
    div.innerHTML = html;
    DomRefs.botMessages.appendChild(div);
    this.scrollBottom();
    StorageUtil.saveChat();
  },
  sendUser(html) {
    const div = document.createElement("div");
    div.className = "bot-msg from-user";
    div.innerHTML = html;
    DomRefs.botMessages.appendChild(div);
    this.scrollBottom();
    StorageUtil.saveChat();
  },
  showLoading() {
    if (AppState.bot.loadingMsgDom) return;
    const div = document.createElement("div");
    div.className = "bot-msg from-bot";
    div.innerHTML = `<div class="bot-typing"><span></span><span></span><span></div>`;
    AppState.bot.loadingMsgDom = div;
    DomRefs.botMessages.appendChild(div);
  },
  hideLoading() {
    if (AppState.bot.loadingMsgDom) {
      AppState.bot.loadingMsgDom.remove();
      AppState.bot.loadingMsgDom = null;
    }
  },
  scrollBottom() {
    if (DomRefs.botMessages) DomRefs.botMessages.scrollTop = DomRefs.botMessages.scrollHeight;
  }
};

// ======================================
// 【功能模块1：关键词渲染复制】
// ======================================
const KeywordModule = {
  renderList() {
    if (!DomRefs.keywordWrap) return;
    const wrap = DomRefs.keywordWrap;
    wrap.innerHTML = "";
    APP_CONFIG.keywordList.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "keyword-chip";
      btn.dataset.keyword = item.text;
      btn.innerHTML = `${item.text}<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`;
      wrap.appendChild(btn);
    });
    this.bindCopyEvent();
  },
  bindCopyEvent() {
    const chips = document.querySelectorAll('.keyword-chip');
    chips.forEach(chip => {
      const originText = chip.dataset.keyword;
      chip.addEventListener('click', async function () {
        const text = this.dataset.keyword;
        try {
          await navigator.clipboard.writeText(text);
          this.classList.add('copied');
          this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>✔已复制`;
          setTimeout(() => {
            this.classList.remove('copied');
            this.innerHTML = `${originText}<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`;
          }, 1500);
        } catch (err) {
          alert(`复制失败，请手动复制：${text}`);
        }
      })
    })
  }
};

// ======================================
// 【功能模块2：轮播控制】
// ======================================
const CarouselModule = {
  init() {
    if (!DomRefs.carousel) return;
    const { dotsWrap, slides, prevBtn, nextBtn, track } = DomRefs;
    const slideLen = slides.length;
    for (let i = 0; i < slideLen; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      if (i === 0) dot.classList.add('active');
      dot.dataset.index = i;
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    const switchSlide = (idx) => {
      AppState.carousel.currentIndex = idx;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    };
    prevBtn.addEventListener('click', () => {
      let idx = AppState.carousel.currentIndex - 1;
      if (idx < 0) idx = slideLen - 1;
      switchSlide(idx);
    });
    nextBtn.addEventListener('click', () => {
      let idx = AppState.carousel.currentIndex + 1;
      if (idx >= slideLen) idx = 0;
      switchSlide(idx);
    });
    dots.forEach(dot => dot.addEventListener('click', () => switchSlide(Number(dot.dataset.index))));
    const startAuto = () => {
      AppState.carousel.timer = setInterval(() => {
        let idx = AppState.carousel.currentIndex + 1;
        if (idx >= slideLen) idx = 0;
        switchSlide(idx);
      }, APP_CONFIG.carousel.interval);
    };
    const stopAuto = () => clearInterval(AppState.carousel.timer);
    DomRefs.carousel.addEventListener('mouseenter', stopAuto);
    DomRefs.carousel.addEventListener('mouseleave', startAuto);
    startAuto();
  }
};

// ======================================
// 【功能模块3：AI机器人弹窗&上传审核】
// ======================================
const BotModule = {
  bindPanelEvent() {
    if (!DomRefs.botBubble) return;
    DomRefs.botBubble.addEventListener('click', () => {
      DomRefs.botPanel.classList.add('open');
      if (AppState.isFirstOpenBot) {
        AppState.isFirstOpenBot = false;
        StorageUtil.saveChat();
        const text = TextReplaceUtil.replace(
          APP_CONFIG.bot.welcomeMsg
        ).replaceAll("{needNum}", APP_CONFIG.bot.needImageCount);
        MsgUtil.sendBot(text);
      }
    });
    DomRefs.botClose?.addEventListener('click', () => DomRefs.botPanel.classList.remove('open'));
    DomRefs.botUploadBtn?.addEventListener('click', () => DomRefs.botFileInput.click());
  },
  bindUploadEvent() {
    if (!DomRefs.botFileInput) return;
    DomRefs.botFileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      const botCfg = APP_CONFIG.bot;
      for (const file of files) {
        let base64;
        try {
          base64 = await ImageUtil.compressFileToBase64(file);
        } catch {
          MsgUtil.sendBotDirect("图片读取失败，请重新上传");
          MsgUtil.scrollBottom();
          continue;
        }
        if (AppState.bot.uploadedBase64Imgs.includes(base64)) {
          MsgUtil.showLoading();
          MsgUtil.scrollBottom();
          MsgUtil.sendUser(`<img src="${base64}" alt="上传截图">`);
          await TimeUtil.randomSleep();
          MsgUtil.hideLoading();
          MsgUtil.sendBotDirect(botCfg.repeatImgFailMsg);
          MsgUtil.scrollBottom();
          continue;
        }
        AppState.bot.uploadedBase64Imgs.push(base64);
        StorageUtil.saveChat();
        MsgUtil.showLoading();
        MsgUtil.scrollBottom();
        MsgUtil.sendUser(`<img src="${base64}" alt="上传截图">`);
        MsgUtil.scrollBottom();
        await TimeUtil.randomSleep();
        MsgUtil.hideLoading();
        const auditPass = Math.random() > APP_CONFIG.auditFailRate;
        if (!auditPass) {
          MsgUtil.sendBotDirect(botCfg.failMsg);
        } else {
          AppState.bot.passCount += 1;
          StorageUtil.saveChat();
          const lack = botCfg.needImageCount - AppState.bot.passCount;
          if (lack > 0) {
            const tip = botCfg.singlePassMsg.replace("{current}", AppState.bot.passCount).replace("{lack}", lack);
            MsgUtil.sendBotDirect(tip);
          } else {
            let linkHtml = "";
            APP_CONFIG.downloadChannels.forEach(ch => {
              if (ch.visible === true) linkHtml += `<a class="bot-download-link" href="${ch.link}" target="_blank">
                        <span class="icon-wrap-md-white">${ch.icon}</span>${ch.text}
                    </a>`;
            });
            const allPassText = TextReplaceUtil.replace(
              botCfg.allPassMsg
            ).replace("{total}", botCfg.needImageCount);
            const tipHtml = botCfg.downloadTip && botCfg.downloadTip.trim()
                ? `<div class="bot-download-tip">${botCfg.downloadTip}</div>`
                : '';
            const fullHtml = `${linkHtml}${tipHtml}`;
            MsgUtil.sendBotDirect(allPassText);
            MsgUtil.sendBotDirect(fullHtml);
          }
        }
        MsgUtil.scrollBottom();
      }
      DomRefs.botFileInput.value = "";
    });
  },
  init() {
    this.bindPanelEvent();
    this.bindUploadEvent();
  }
};

// ======================================
// 【工具模块3：图片处理（聊天上传压缩）】
// ======================================
const ImageUtil = {
  compressFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const cfg = APP_CONFIG.imageCompress;
          let w = cfg.maxWidth;
          let h = img.height * (w / img.width);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          const base64 = canvas.toDataURL("image/jpeg", cfg.quality);
          resolve(base64);
        };
        img.onerror = () => resolve(e.target.result);
      };
      reader.onerror = reject;
    });
  }
};

// ======================================
// 【页面全局初始化入口】
// ======================================
function pageInit() {
  TaskTemplateHelper.initTemplate();
  initDomRefs();
  StorageUtil.loadChat();
  KeywordModule.renderList();
  CarouselModule.init();
  BotModule.init();

  if (DomRefs.yearText) DomRefs.yearText.innerText = new Date().getFullYear();
}

// 等待所有资源加载完成再执行初始化，彻底规避时序问题
window.onload = pageInit;