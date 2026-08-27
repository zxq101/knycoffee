/* ============================================
   肯尼亚咖啡豆种植系统 - 主逻辑
   页面导航、事件绑定、Toast通知
   ============================================ */

const App = {

  currentPage: 'dashboard',
  soilWeatherData: null,
  lastDecision: null,
  lang: localStorage.getItem('coffee_lang') || 'zh',

  /** === 初始化 === */
  init() {
    this._loadUserInfo();
    this._bindNavigation();
    this._bindMenuToggle();
    this._bindDataForm();
    this._bindChat();
    this._bindQuickQuestions();
    this._bindLogout();
    this._bindPushActions();
    this._bindLanguageSwitcher();
    this._initRangeVisuals();

    // 尝试恢复数据
    this._loadSavedData();

    // 初始化时强制同步问答机器人语言，确保和界面一致
    if (window.CoffeeChatBot) CoffeeChatBot.lang = this.lang;
    if (window.CoffeeDecisionEngine) CoffeeDecisionEngine.lang = this.lang;

    // 应用语言（与登录页保持一致）
    this._applyLanguage();
  },

  /** === 页面导航 === */
  _bindNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        this.navigateTo(page);
      });
    });
  },

  navigateTo(page) {
    // 更新侧边栏
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const navItem = document.querySelector(`[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');

    // 切换页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) pageEl.classList.add('active');

    this.currentPage = page;

    // 如果切换到仪表盘，刷新数据
    if (page === 'dashboard' && this.soilWeatherData) {
      this._refreshDashboard();
    }

    // 关闭移动端侧边栏
    document.getElementById('sidebar').classList.remove('open');
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  /** === 移动端菜单 === */
  _bindMenuToggle() {
    const btn = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    };

    btn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      overlay.classList.toggle('active', isOpen);
    });

    // 点击遮罩关闭
    overlay.addEventListener('click', closeSidebar);

    // 点击主内容区域关闭
    document.getElementById('mainContent').addEventListener('click', closeSidebar);
  },

  /** === 数据表单 === */
  _bindDataForm() {
    const form = document.getElementById('dataForm');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._analyzeData();
    });

    document.getElementById('btnReset').addEventListener('click', () => {
      this._resetForm();
    });
  },

  _getFormData() {
    return {
      soilPH: parseFloat(document.getElementById('soil-ph').value),
      soilOrganic: parseFloat(document.getElementById('soil-organic').value),
      soilN: parseFloat(document.getElementById('soil-n').value),
      soilP: parseFloat(document.getElementById('soil-p').value),
      soilK: parseFloat(document.getElementById('soil-k').value),
      soilMoisture: parseFloat(document.getElementById('soil-moisture').value),
      soilType: document.getElementById('soil-type').value,
      avgTemp: parseFloat(document.getElementById('weather-temp').value),
      monthlyRain: parseFloat(document.getElementById('weather-rain').value),
      sunHours: parseFloat(document.getElementById('weather-sun').value),
      humidity: parseFloat(document.getElementById('weather-humidity').value),
      altitude: parseFloat(document.getElementById('weather-altitude').value),
      currentMonth: parseInt(document.getElementById('weather-month').value),
      treeAge: parseFloat(document.getElementById('tree-age').value),
      timestamp: new Date().toISOString()
    };
  },

  _analyzeData() {
    const data = this._getFormData();
    this.soilWeatherData = data;

    // 运行决策引擎
    const results = CoffeeDecisionEngine.generate(data);
    this.lastDecision = { data, results };

    // 保存
    this._saveData();

    // 渲染决策页面
    this._renderDecision(data, results);

    // 刷新仪表盘
    this._refreshDashboard();

    // 生成推送指令
    this._generatePushInstructions(data, results);

    // 跳转到决策页面
    this.navigateTo('decision');

    this.showToast(this.t('analyzeDone'), '');
  },

  /** 渲染决策 */
  _renderDecision(data, results) {
    const container = document.getElementById('decisionContent');
    const html = CoffeeDecisionEngine.renderHTML(data, results);
    container.innerHTML = html;
  },

  /** 刷新仪表盘 */
  _refreshDashboard() {
    const d = this.soilWeatherData;
    if (!d) return;

    document.getElementById('stat-ph').textContent = d.soilPH;
    document.getElementById('stat-temp').textContent = `${d.avgTemp}°C`;
    document.getElementById('stat-rain').textContent = `${d.monthlyRain}mm`;
    document.getElementById('stat-moisture').textContent = `${d.soilMoisture}%`;

    // 更新状态标签
    const setStatus = (id, evalObj) => {
      const el = document.getElementById(id);
      if (!el) return;
      const cls = evalObj.level === 'good' ? 'good' :
                  evalObj.level === 'warning' ? 'warning' : 'bad';
      el.textContent = evalObj.text;
      el.className = `stat-status ${cls}`;
    };

    if (this.lastDecision) {
      const ev = this.lastDecision.results.allEvaluations;
      setStatus('stat-ph-status', ev.ph);
      setStatus('stat-temp-status', ev.temperature);
      setStatus('stat-rain-status', ev.rainfall);
      setStatus('stat-moisture-status', ev.moisture);
    }

    // 健康度进度条（按各自合理区间归一化）
    const setBar = (id, pct) => {
      const el = document.getElementById(id);
      if (!el) return;
      const v = Math.max(0, Math.min(100, pct));
      el.style.width = v + '%';
      el.classList.toggle('empty', v === 0);
    };
    setBar('bar-ph', (d.soilPH - 4) / (7.5 - 4) * 100);
    setBar('bar-temp', (d.avgTemp - 5) / (35 - 5) * 100);
    setBar('bar-rain', d.monthlyRain / 300 * 100);
    setBar('bar-moisture', d.soilMoisture);
  },

  /** 生成推送指令 */
  _generatePushInstructions(data, results) {
    const pushList = document.getElementById('pushList');
    const pushCount = document.getElementById('push-count');
    const instructions = [];

    // 从施肥建议生成推送
    results.fertilizer.forEach(f => {
      const title = `${f.type}：${f.product}`;
      const desc = `${this.t('pushUsage')}：${f.amount} | ${this.t('pushTime')}：${f.timing}`;
      instructions.push({
        type: f.priority === '高' ? 'urgent' : 'info',
        icon: '🌱',
        title,
        desc,
        detail: f.detail,
        key: `fert|${title}|${desc}`
      });
    });

    // 从修剪建议生成推送
    results.pruning.forEach(p => {
      const title = p.type;
      const desc = `${this.t('pushTime')}：${p.timing} | ${p.method.substring(0, 40)}...`;
      instructions.push({
        type: p.priority === '高' ? 'urgent' : 'info',
        icon: '✂️',
        title,
        desc,
        detail: p.detail,
        key: `prun|${title}|${desc}`
      });
    });

    // 警告
    results.warnings.forEach(w => {
      const msg = w.msg;
      instructions.push({
        type: w.level === 'bad' ? 'urgent' : 'info',
        icon: '⚠️',
        title: msg.substring(0, 60),
        desc: '',
        detail: msg,
        key: `warn|${msg}`
      });
    });

    // 读取已完成记录
    const doneSet = new Set(JSON.parse(localStorage.getItem('coffee_done_pushes') || '[]'));

    // 渲染推送列表
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    const dateStr = now.toLocaleDateString(this.lang === 'zh' ? 'zh-CN' : 'en-US');

    if (instructions.length === 0) {
      pushList.innerHTML = `
        <div class="push-empty">
          <div class="empty-icon">✅</div>
          <p>${this.t('pushAllGood')}</p>
        </div>`;
      pushCount.textContent = this.t('pushPendingZero');
      this._popBadge(pushCount);
      return;
    }

    const pendingCount = instructions.filter(inst => !doneSet.has(inst.key)).length;

    pushList.innerHTML = instructions.map((inst, i) => {
      const done = doneSet.has(inst.key);
      return `
        <div class="push-item ${inst.type}${done ? ' done' : ''}">
          <div class="push-icon">${done ? '✅' : inst.icon}</div>
          <div class="push-body">
            <div class="push-title">${inst.title}</div>
            ${inst.desc ? `<div class="push-desc">${inst.desc}</div>` : ''}
            <div class="push-time">📅 ${dateStr} ${timeStr} · ${this.t('pushInstructionNo', {n: i+1})}</div>
            ${inst.detail ? `<span class="push-action">📋 ${inst.detail.substring(0, 50)}${inst.detail.length > 50 ? '...' : ''}</span>` : ''}
            <div class="push-actions">
              <button type="button" class="push-done-btn${done ? ' done' : ''}" data-key="${inst.key}">
                ${done ? '✅ ' + this.t('pushDone') : '☑️ ' + this.t('pushMarkDone')}
              </button>
            </div>
          </div>
        </div>`;
    }).join('');

    pushCount.textContent = this.t('pushPending', { n: pendingCount });
    this._popBadge(pushCount);
  },

  /** 徽章数字弹跳动画 */
  _popBadge(el) {
    if (!el) return;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  },

  /** 绑定推送指令“标记完成” */
  _bindPushActions() {
    const pushList = document.getElementById('pushList');
    if (!pushList) return;
    pushList.addEventListener('click', (e) => {
      const btn = e.target.closest('.push-done-btn');
      if (!btn || !btn.dataset.key) return;

      const doneSet = new Set(JSON.parse(localStorage.getItem('coffee_done_pushes') || '[]'));
      if (doneSet.has(btn.dataset.key)) {
        doneSet.delete(btn.dataset.key);
      } else {
        doneSet.add(btn.dataset.key);
      }
      localStorage.setItem('coffee_done_pushes', JSON.stringify([...doneSet]));

      // 重新渲染推送列表，保持与已保存数据一致
      if (this.lastDecision) {
        this._generatePushInstructions(this.lastDecision.data, this.lastDecision.results);
      }
    });
  },

  _resetForm() {
    document.querySelectorAll('#dataForm input[type=range]').forEach(input => {
      input.value = input.defaultValue;
      input.nextElementSibling.value = input.defaultValue;
    });
    document.getElementById('weather-altitude').value = '1600';
    document.getElementById('weather-month').value = '8';
    document.getElementById('tree-age').value = '5';
    this._refreshRangeFill();
    this.showToast(this.t('resetDone'), '');
  },

  /** 滑块轨道渐变填充（初始化绑定） */
  _initRangeVisuals() {
    const ranges = document.querySelectorAll('#page-input input[type="range"]');
    if (!ranges.length) return;
    const form = document.getElementById('dataForm');
    const fill = (r) => {
      const min = parseFloat(r.min) || 0;
      const max = parseFloat(r.max) || 100;
      const v = parseFloat(r.value) || min;
      const pct = Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
      r.style.background = `linear-gradient(to right, #48b865 ${pct}%, #e4ece4 ${pct}%)`;
    };
    ranges.forEach(r => {
      fill(r);
      r.addEventListener('input', () => fill(r));
    });
    if (form) {
      form.addEventListener('reset', () => {
        requestAnimationFrame(() => ranges.forEach(fill));
      });
    }
  },

  /** 刷新滑块渐变填充（恢复/重置数据后调用） */
  _refreshRangeFill() {
    document.querySelectorAll('#page-input input[type="range"]').forEach(r => {
      const min = parseFloat(r.min) || 0;
      const max = parseFloat(r.max) || 100;
      const v = parseFloat(r.value) || min;
      const pct = Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
      r.style.background = `linear-gradient(to right, #48b865 ${pct}%, #e4ece4 ${pct}%)`;
    });
  },

  /** === 用户信息与登出 === */
  _loadUserInfo() {
    const userData = JSON.parse(
      localStorage.getItem('coffee_user_data') ||
      sessionStorage.getItem('coffee_user_data') ||
      '{}'
    );
    document.getElementById('sidebarUserName').textContent = userData.username || this.t('defaultUser');
    document.getElementById('sidebarUserEmail').textContent = userData.email || '';
  },

  _bindLogout() {
    document.getElementById('btnLogout').addEventListener('click', () => {
      if (confirm(this.t('confirmLogout'))) {
        // 清除所有登录信息
        localStorage.removeItem('coffee_user_token');
        sessionStorage.removeItem('coffee_user_token');
        localStorage.removeItem('coffee_user_data');
        sessionStorage.removeItem('coffee_user_data');
        // 跳转到登录页
        window.location.href = 'auth.html';
      }
    });
  },

  /** === 语言切换 === */
  _bindLanguageSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;
    switcher.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (!lang || (lang !== 'zh' && lang !== 'en' && lang !== 'sw')) return;
        this.lang = lang;
        localStorage.setItem('coffee_lang', lang);
        if (window.CoffeeChatBot) CoffeeChatBot.lang = lang;
        if (window.CoffeeDecisionEngine) CoffeeDecisionEngine.lang = lang;
        this._applyLanguage();
      });
    });
  },

  /** === 智能问答 === */
  _bindChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('btnSend');

    sendBtn.addEventListener('click', () => this._sendMessage());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._sendMessage();
      }
    });
  },

  _bindQuickQuestions() {
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.dataset.question;
        document.getElementById('chatInput').value = question;
        this._sendMessage();
      });
    });
  },

  async _sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    // 添加用户消息
    this._addChatBubble('user', msg);
    input.value = '';

    // 显示打字效果
    const typingId = this._addTypingIndicator();

    // 获取回答
    try {
      const answer = await CoffeeChatBot.ask(msg);
      this._removeTypingIndicator(typingId);
      this._addChatBubble('bot', answer);
    } catch (err) {
      this._removeTypingIndicator(typingId);
      this._addChatBubble('bot', this.t('chatError'));
    }
  },

  _addChatBubble(type, content) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `chat-bubble ${type}`;
    const avatar = type === 'bot' ? '🤖' : '👨‍🌾';
    // 将 markdown 风格的简单格式转为 HTML
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/\|(.+)\|/g, (match) => {
        // simple table detection
        return match;
      });
    div.innerHTML = `
      <div class="bubble-avatar">${avatar}</div>
      <div class="bubble-content">${html}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  _addTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'chat-bubble bot';
    div.innerHTML = `
      <div class="bubble-avatar">🤖</div>
      <div class="bubble-content"><div class="chat-typing"><span></span><span></span><span></span></div></div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
  },

  _removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  },

  /** === 多语言（与登录页共用 coffee_lang） === */
  LANG: {
    zh: {
      pageTitle: '肯尼亚咖啡豆智能种植管理系统',
      sidebarBrandSub: '智能种植管理系统',
      navDashboard: '数据仪表盘',
      navInput: '数据录入',
      navDecision: '智能决策',
      navChat: '智能问答',
      defaultUser: '用户',
      userNotLoggedIn: '未登录',
      logout: '退出登录',
      logoutTitle: '退出登录',
      langAria: '切换语言',
      dashTitle: '📊 数据仪表盘',
      dashSubtitle: '肯尼亚咖啡种植数据总览',
      statPh: '土壤pH',
      statTemp: '平均温度',
      statRain: '月降雨量',
      statMoisture: '土壤湿度',
      waitingData: '等待录入',
      pushTitle: '📋 最新种植指令推送',
      pushPendingZero: '0条待处理',
      pushPending: '{n}条待处理',
      pushEmpty: '暂无指令，请先录入土壤和气象数据',
      pushAllGood: '当前种植条件良好，暂无紧急指令',
      pushUsage: '用量',
      pushTime: '时间',
      pushInstructionNo: '指令 #{n}',
      pushMarkDone: '标记完成',
      pushDone: '已完成',
      inputTitle: '📝 数据录入',
      inputSubtitle: '录入肯尼亚咖啡种植区的土壤与气象数据',
      soilDataTitle: '🌱 土壤数据',
      soilPhLabel: '土壤pH值',
      soilOrganicLabel: '有机质含量 (%)',
      soilNLabel: '氮含量 N (mg/kg)',
      soilPLabel: '磷含量 P (mg/kg)',
      soilKLabel: '钾含量 K (mg/kg)',
      soilMoistureLabel: '土壤湿度 (%)',
      soilTypeLabel: '土壤类型',
      soilTypeVolcanic: '火山土（Nitisols）',
      soilTypeRed: '红壤（Ferralsols）',
      soilTypeSandy: '沙壤土',
      soilTypeClay: '黏土',
      soilTypeLoam: '壤土',
      weatherDataTitle: '🌤️ 气象数据',
      weatherTempLabel: '平均温度 (°C)',
      weatherRainLabel: '月降雨量 (mm)',
      weatherSunLabel: '日照时长 (小时/天)',
      weatherHumidityLabel: '相对湿度 (%)',
      weatherAltitudeLabel: '海拔高度 (m)',
      weatherMonthLabel: '当前月份',
      treeAgeLabel: '咖啡树树龄 (年)',
      month1: '一月 January', month2: '二月 February', month3: '三月 March',
      month4: '四月 April', month5: '五月 May', month6: '六月 June',
      month7: '七月 July', month8: '八月 August', month9: '九月 September',
      month10: '十月 October', month11: '十一月 November', month12: '十二月 December',
      btnAnalyze: '分析数据并生成决策',
      btnReset: '恢复默认',
      decisionTitle: '🧠 智能决策建议',
      decisionSubtitle: '基于土壤与气象数据的AI决策分析',
      decisionEmptyTitle: '暂无决策建议',
      decisionEmptyDesc: '请先在「数据录入」页面输入土壤和气象数据，点击"分析数据并生成决策"按钮',
      goToInput: '→ 前往数据录入',
      chatTitle: '💬 智能问答助手',
      chatSubtitle: '关于肯尼亚咖啡种植的任何问题，我都可以为您解答',
      chatWelcome1: '您好！我是肯尼亚咖啡种植助手 ☕',
      chatWelcome2: '您可以问我关于：',
      chatTopic1: '🌱 土壤管理（pH调节、施肥方案）',
      chatTopic2: '✂️ 修剪技术（时间、方法、树形管理）',
      chatTopic3: '🐛 病虫害防治（常见病害识别与防治）',
      chatTopic4: '🌧️ 气象与灌溉（水分管理、气候适应）',
      chatTopic5: '🌿 品种选择（SL28、SL34、Ruiru 11等）',
      chatTopic6: '📜 发展历史与六大产区',
      chatTopic7: '🍒 收获处理与等级拍卖',
      chatTopic8: '🔥 烘焙冲煮与风味',
      chatWelcome3: '请随时提问！',
      quickLabel: '快捷提问：',
      quickFert: '施肥时间',
      quickPrune: '修剪时间',
      quickRust: '叶锈病防治',
      quickPh: '土壤pH',
      quickYellow: '叶子发黄',
      quickBuy: '选购建议',
      quickFertQ: '肯尼亚咖啡最佳施肥时间是什么时候？',
      quickPruneQ: '咖啡树什么时候需要修剪？',
      quickRustQ: '咖啡叶锈病怎么防治？',
      quickPhQ: '肯尼亚咖啡适宜的土壤pH是多少？',
      quickYellowQ: '咖啡叶子发黄怎么办？',
      quickBuyQ: '如何选购正宗的肯尼亚咖啡豆？',
      chatPlaceholder: '输入您的问题...',
      btnSend: '发送 ✈️',
      analyzeDone: '✅ 数据分析和决策生成完毕',
      resetDone: '已恢复默认值',
      confirmLogout: '确定要退出登录吗？',
      chatError: '抱歉，我暂时无法回答这个问题。请稍后再试。'
    },
    en: {
      pageTitle: 'Kenya Coffee Intelligent Cultivation System',
      sidebarBrandSub: 'Intelligent Cultivation System',
      navDashboard: 'Dashboard',
      navInput: 'Data Entry',
      navDecision: 'Smart Decisions',
      navChat: 'AI Chat',
      defaultUser: 'User',
      userNotLoggedIn: 'Not logged in',
      logout: 'Log Out',
      logoutTitle: 'Log Out',
      langAria: 'Switch language',
      dashTitle: '📊 Dashboard',
      dashSubtitle: 'Overview of Kenya coffee cultivation data',
      statPh: 'Soil pH',
      statTemp: 'Avg Temperature',
      statRain: 'Monthly Rainfall',
      statMoisture: 'Soil Moisture',
      waitingData: 'Awaiting data',
      pushTitle: '📋 Latest Cultivation Instructions',
      pushPendingZero: '0 pending',
      pushPending: '{n} pending',
      pushEmpty: 'No instructions yet. Enter soil and weather data first.',
      pushAllGood: 'Conditions are good; no urgent instructions.',
      pushUsage: 'Dosage',
      pushTime: 'Time',
      pushInstructionNo: 'Instruction #{n}',
      pushMarkDone: 'Mark Done',
      pushDone: 'Done',
      inputTitle: '📝 Data Entry',
      inputSubtitle: 'Enter soil and weather data for Kenya coffee growing areas',
      soilDataTitle: '🌱 Soil Data',
      soilPhLabel: 'Soil pH Value',
      soilOrganicLabel: 'Organic Matter (%)',
      soilNLabel: 'Nitrogen N (mg/kg)',
      soilPLabel: 'Phosphorus P (mg/kg)',
      soilKLabel: 'Potassium K (mg/kg)',
      soilMoistureLabel: 'Soil Moisture (%)',
      soilTypeLabel: 'Soil Type',
      soilTypeVolcanic: 'Volcanic (Nitisols)',
      soilTypeRed: 'Red Soil (Ferralsols)',
      soilTypeSandy: 'Sandy Loam',
      soilTypeClay: 'Clay',
      soilTypeLoam: 'Loam',
      weatherDataTitle: '🌤️ Weather Data',
      weatherTempLabel: 'Avg Temperature (°C)',
      weatherRainLabel: 'Monthly Rainfall (mm)',
      weatherSunLabel: 'Sunlight (hours/day)',
      weatherHumidityLabel: 'Relative Humidity (%)',
      weatherAltitudeLabel: 'Altitude (m)',
      weatherMonthLabel: 'Current Month',
      treeAgeLabel: 'Coffee Tree Age (years)',
      month1: 'January', month2: 'February', month3: 'March',
      month4: 'April', month5: 'May', month6: 'June',
      month7: 'July', month8: 'August', month9: 'September',
      month10: 'October', month11: 'November', month12: 'December',
      btnAnalyze: 'Analyze & Generate Decisions',
      btnReset: 'Reset',
      decisionTitle: '🧠 Smart Decision Advice',
      decisionSubtitle: 'AI decision analysis based on soil & weather data',
      decisionEmptyTitle: 'No decisions yet',
      decisionEmptyDesc: 'Enter soil & weather data on the Data Entry page, then click "Analyze & Generate Decisions"',
      goToInput: '→ Go to Data Entry',
      chatTitle: '💬 AI Chat Assistant',
      chatSubtitle: 'Ask me anything about Kenya coffee cultivation',
      chatWelcome1: 'Hello! I am your Kenya coffee assistant ☕',
      chatWelcome2: 'You can ask me about:',
      chatTopic1: '🌱 Soil management (pH adjustment, fertilization)',
      chatTopic2: '✂️ Pruning (timing, methods, tree management)',
      chatTopic3: '🐛 Pest & disease control (detection & treatment)',
      chatTopic4: '🌧️ Weather & irrigation (water management, climate)',
      chatTopic5: '🌿 Variety selection (SL28, SL34, Ruiru 11, etc.)',
      chatTopic6: '📜 History & six growing regions',
      chatTopic7: '🍒 Harvesting, processing & auction grades',
      chatTopic8: '🔥 Roasting, brewing & flavor',
      chatWelcome3: 'Feel free to ask!',
      quickLabel: 'Quick questions:',
      quickFert: 'Fertilizing',
      quickPrune: 'Pruning',
      quickRust: 'Leaf Rust',
      quickPh: 'Soil pH',
      quickYellow: 'Yellow leaves',
      quickBuy: 'Buying tips',
      quickFertQ: 'What is the best time to fertilize Kenya coffee?',
      quickPruneQ: 'When should coffee trees be pruned?',
      quickRustQ: 'How to control coffee leaf rust?',
      quickPhQ: 'What is the ideal soil pH for Kenya coffee?',
      quickYellowQ: 'Why are my coffee leaves turning yellow?',
      quickBuyQ: 'How can I identify authentic Kenya coffee?',
      chatPlaceholder: 'Type your question...',
      btnSend: 'Send ✈️',
      analyzeDone: '✅ Analysis and decisions generated',
      resetDone: 'Values restored to defaults',
      confirmLogout: 'Are you sure you want to log out?',
      chatError: 'Sorry, I cannot answer this right now. Please try again later.'
    },
    sw: {
      pageTitle: 'Mfumo wa Uzalishaji wa Kahawa ya Kenya',
      sidebarBrandSub: 'Mfumo wa Uzalishaji wa Akili',
      navDashboard: 'Dashibodi',
      navInput: 'Weka Data',
      navDecision: 'Maamuzi ya Akili',
      navChat: 'Msaada wa AI',
      defaultUser: 'Mtumiaji',
      userNotLoggedIn: 'Haujaingia',
      logout: 'Toka',
      logoutTitle: 'Toka',
      langAria: 'Badilisha lugha',
      dashTitle: '📊 Dashibodi',
      dashSubtitle: 'Muhtasari wa data za kilimo kahawa ya Kenya',
      statPh: 'pH ya Udongo',
      statTemp: 'Joto la Wastani',
      statRain: 'Mvua ya Mwezi',
      statMoisture: 'Unyevu wa Udongo',
      waitingData: 'Inasubiri data',
      pushTitle: '📋 Maagizo ya Kilimo',
      pushPendingZero: '0 yanayosubiri',
      pushPending: '{n} yanayosubiri',
      pushEmpty: 'Hakuna maagizo. Weka data za udongo na hali ya hewa kwanza.',
      pushAllGood: 'Hali ni nzuri; hakuna maagizo ya haraka.',
      pushUsage: 'Kiasi',
      pushTime: 'Wakati',
      pushInstructionNo: 'Agizo #{n}',
      pushMarkDone: 'Weka Alama',
      pushDone: 'Imekamilika',
      inputTitle: '📝 Weka Data',
      inputSubtitle: 'Weka data za udongo na hali ya hewa za eneo la kilimo kahawa ya Kenya',
      soilDataTitle: '🌱 Data za Udongo',
      soilPhLabel: 'Thamani ya pH ya Udongo',
      soilOrganicLabel: 'Matter ya Kiumbe (%)',
      soilNLabel: 'Nitrojeni N (mg/kg)',
      soilPLabel: 'Fosforasi P (mg/kg)',
      soilKLabel: 'Potasi K (mg/kg)',
      soilMoistureLabel: 'Unyevu wa Udongo (%)',
      soilTypeLabel: 'Aina ya Udongo',
      soilTypeVolcanic: 'Volcanic (Nitisols)',
      soilTypeRed: 'Red Soil (Ferralsols)',
      soilTypeSandy: 'Sandy Loam',
      soilTypeClay: 'Clay',
      soilTypeLoam: 'Loam',
      weatherDataTitle: '🌤️ Data ya Hali ya Hewa',
      weatherTempLabel: 'Joto la Wastani (°C)',
      weatherRainLabel: 'Mvua ya Mwezi (mm)',
      weatherSunLabel: 'Muda wa Jua (saa/siku)',
      weatherHumidityLabel: 'Unyevu wa Hewa (%)',
      weatherAltitudeLabel: 'Mwinuko (m)',
      weatherMonthLabel: 'Mwezi wa Sasa',
      treeAgeLabel: 'Umri wa Mti wa Kahawa (miaka)',
      month1: 'Januari', month2: 'Februari', month3: 'Machi',
      month4: 'Aprili', month5: 'Mei', month6: 'Juni',
      month7: 'Julai', month8: 'Agosti', month9: 'Septemba',
      month10: 'Oktoba', month11: 'Novemba', month12: 'Desemba',
      btnAnalyze: 'Chambua & Tengeneza Maamuzi',
      btnReset: 'Weka Upya',
      decisionTitle: '🧠 Mashauri ya Maamuzi ya Akili',
      decisionSubtitle: 'Uchambuzi wa maamuzi wa AI kulingana na data za udongo na hali ya hewa',
      decisionEmptyTitle: 'Hakuna maamuzi bado',
      decisionEmptyDesc: 'Weka data za udongo na hali ya hewa kwenye ukurasa wa Weka Data, kisha bofya "Chambua & Tengeneza Maamuzi"',
      goToInput: '→ Nenda kwa Weka Data',
      chatTitle: '💬 Msaada wa AI',
      chatSubtitle: 'Niulize chochote kuhusu kilimo kahawa ya Kenya',
      chatWelcome1: 'Habari! Mimi ni msaidizi wako wa kahawa ya Kenya ☕',
      chatWelcome2: 'Unaweza kuniuliza kuhusu:',
      chatTopic1: '🌱 Usimamizi wa udongo (urekebishaji wa pH, mbolea)',
      chatTopic2: '✂️ Ukataji (wakati, mbinu, usimamizi wa mti)',
      chatTopic3: '🐛 Kudhibiti wadudu na magonjwa (kutambua na matibabu)',
      chatTopic4: '🌧️ Hali ya hewa na umwagiliaji (usimamizi wa maji, hali ya hewa)',
      chatTopic5: '🌿 Uchaguzi wa aina (SL28, SL34, Ruiru 11, n.k.)',
      chatTopic6: '📜 Historia na mikoa sita ya uzalishaji',
      chatTopic7: '🍒 Kuvuna, usindikaji na daraja za mnada',
      chatTopic8: '🔥 Kuchoma, kutengeneza na ladha',
      chatWelcome3: 'Uliza kwa uhuru!',
      quickLabel: 'Maswali ya haraka:',
      quickFert: 'Kutoa Mbolea',
      quickPrune: 'Kukatia',
      quickRust: 'Kutu ya Majani',
      quickPh: 'pH ya Udongo',
      quickYellow: 'Majani mekundu',
      quickBuy: 'Kununua',
      quickFertQ: 'Ni wakati gani mzuri zaidi wa kutoa mbolea kahawa ya Kenya?',
      quickPruneQ: 'Miti ya kahawa inapaswa kukatiwa lini?',
      quickRustQ: 'Jinsi ya kudhibiti kutu ya majani ya kahawa?',
      quickPhQ: 'pH gani bora ya udongo kwa kahawa ya Kenya?',
      quickYellowQ: 'Kwa nini majani ya kahawa yangu yanaweza njano?',
      quickBuyQ: 'Ninawezaje kutambua kahawa halisi ya Kenya?',
      chatPlaceholder: 'Andika swali lako...',
      btnSend: 'Tuma ✈️',
      analyzeDone: '✅ Uchambuzi na maamuzi yametengenezwa',
      resetDone: 'Thamani zimerudishwa kwa chaguo-msingi',
      confirmLogout: 'Una uhakika unataka kutoka?',
      chatError: 'Samahani, siwezi kujibu hivi sasa. Tafadhali jaribu tena baadaye.'
    }
  },

  t(key, params) {
    const dict = this.LANG[this.lang] || this.LANG.zh;
    let str = dict[key] !== undefined ? dict[key] : (this.LANG.zh[key] !== undefined ? this.LANG.zh[key] : key);
    if (params) {
      Object.keys(params).forEach(k => {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
      });
    }
    return str;
  },

  _applyLanguage() {
    const htmlLang = { zh: 'zh-CN', en: 'en', sw: 'sw' };
    document.documentElement.lang = htmlLang[this.lang] || 'zh-CN';
    document.title = this.t('pageTitle');

    // 更新语言切换按钮激活状态
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.lang);
    });
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', this.t(el.dataset.i18nAria));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.setAttribute('title', this.t(el.dataset.i18nTitle));
    });
    // 快捷提问按钮的问题文本跟随语言切换
    document.querySelectorAll('.quick-btn').forEach(btn => {
      const qKey = btn.dataset.i18n ? 'quick' + btn.dataset.i18n.slice(5) + 'Q' : null;
      if (qKey) btn.dataset.question = this.t(qKey);
    });
    // 语言切换后，重新生成决策内容（决策引擎文本跟随语言）
    if (this.soilWeatherData) {
      const results = CoffeeDecisionEngine.generate(this.soilWeatherData);
      this.lastDecision = { data: this.soilWeatherData, results };
      this._refreshDashboard();
      this._generatePushInstructions(this.soilWeatherData, results);
      const savedDecision = localStorage.getItem('coffee_decision');
      if (savedDecision) this._renderDecision(this.soilWeatherData, results);
    }
  },

  /** === Toast 通知 === */
  showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  },

  /** === 数据持久化 === */
  _saveData() {
    if (this.soilWeatherData) {
      localStorage.setItem('coffee_data', JSON.stringify(this.soilWeatherData));
    }
    if (this.lastDecision) {
      localStorage.setItem('coffee_decision', JSON.stringify({
        data: this.lastDecision.data,
        timestamp: Date.now()
      }));
    }
  },

  _loadSavedData() {
    const saved = localStorage.getItem('coffee_data');
    if (saved) {
      try {
        this.soilWeatherData = JSON.parse(saved);
        const data = this.soilWeatherData;
        // 恢复表单值
        document.getElementById('soil-ph').value = data.soilPH;
        document.getElementById('soil-ph').nextElementSibling.value = data.soilPH;
        document.getElementById('soil-organic').value = data.soilOrganic;
        document.getElementById('soil-organic').nextElementSibling.value = data.soilOrganic;
        document.getElementById('soil-n').value = data.soilN;
        document.getElementById('soil-n').nextElementSibling.value = data.soilN;
        document.getElementById('soil-p').value = data.soilP;
        document.getElementById('soil-p').nextElementSibling.value = data.soilP;
        document.getElementById('soil-k').value = data.soilK;
        document.getElementById('soil-k').nextElementSibling.value = data.soilK;
        document.getElementById('soil-moisture').value = data.soilMoisture;
        document.getElementById('soil-moisture').nextElementSibling.value = data.soilMoisture;
        if (data.soilType) document.getElementById('soil-type').value = data.soilType;
        document.getElementById('weather-temp').value = data.avgTemp;
        document.getElementById('weather-temp').nextElementSibling.value = data.avgTemp;
        document.getElementById('weather-rain').value = data.monthlyRain;
        document.getElementById('weather-rain').nextElementSibling.value = data.monthlyRain;
        document.getElementById('weather-sun').value = data.sunHours;
        document.getElementById('weather-sun').nextElementSibling.value = data.sunHours;
        document.getElementById('weather-humidity').value = data.humidity;
        document.getElementById('weather-humidity').nextElementSibling.value = data.humidity;
        if (data.altitude) document.getElementById('weather-altitude').value = data.altitude;
        if (data.currentMonth) document.getElementById('weather-month').value = data.currentMonth;
        if (data.treeAge) document.getElementById('tree-age').value = data.treeAge;
        this._refreshRangeFill();

        // 重新生成决策
        const results = CoffeeDecisionEngine.generate(data);
        this.lastDecision = { data, results };
        this._refreshDashboard();
        this._generatePushInstructions(data, results);

        // 渲染决策
        const savedDecision = localStorage.getItem('coffee_decision');
        if (savedDecision) {
          this._renderDecision(data, results);
        }
      } catch (e) {
        console.warn('数据恢复失败:', e);
      }
    }
  }
};

// === 启动应用 ===
document.addEventListener('DOMContentLoaded', () => App.init());
