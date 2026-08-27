/* ============================================
   肯尼亚咖啡豆种植系统 - 登录/注册认证
   图片轮播(3s) + 表单正确性验证 + API注册
   ============================================ */

const Auth = {

  currentSlide: 0,
  totalSlides: 5,
  carouselTimer: null,
  CAROUSEL_INTERVAL: 3000,
  API_URL: 'https://quickform.cn/api/6tumxg44zn',
  paused: false,
  lang: localStorage.getItem('coffee_lang') || 'zh',
  forgotState: { step: 1, email: '', code: '', timer: null, countdown: 0 },

  /* ====== 正则规则 ====== */
  RULES: {
    username: /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  /* ====== 多语言字典 ====== */
  LANG: {
    zh: {
      pageTitle: '登录 - 肯尼亚咖啡豆智能种植管理系统',
      captionBadge: 'Kenya · AA Grade',
      captionTitle: '肯尼亚咖啡豆',
      captionSubtitle: '智能种植管理系统',
      captionDesc: '基于土壤与气象数据的AI精准种植决策平台',
      statNum1: '5+', statNum2: '多维', statNum3: '智能',
      statModel: 'AI决策模型',
      statData: '数据录入',
      statDecision: '种植决策',
      logoSub: '智能种植 · 精准决策 · 丰收可期',
      tabLogin: '登 录',
      tabRegister: '注 册',
      phLoginUsername: '用户名或邮箱',
      phLoginPassword: '密码',
      phRegUsername: '用户名',
      phRegEmail: '邮箱地址',
      phRegPassword: '设置密码（至少8位，大小写+数字）',
      phRegConfirm: '确认密码',
      rememberMe: '记住我',
      forgot: '忘记密码？',
      forgotModalTitle: '找回密码',
      forgotTip: '输入注册邮箱，验证通过后即可重置密码',
      forgotStep1: '账号验证',
      forgotStep2: '验证码',
      forgotStep3: '重置密码',
      forgotEmailPh: '注册邮箱',
      forgotEmailInvalid: '请输入有效的邮箱地址',
      forgotNotExist: '该邮箱未注册，请检查后重试',
      forgotGetCode: '获取验证码',
      forgotCodeSent: '验证码已发送至',
      forgotCheckMail: '，请查收邮件完成验证',
      forgotSendFail: '验证码发送失败，请稍后重试',
      forgotMailCfg: '邮件服务未配置或不可用，请部署到 Netlify 并配置发送渠道',
      forgotTooFreq: '发送过于频繁，请 60 秒后再试',
      forgotCodeExpired: '验证码已过期，请重新获取',
      forgotCodePh: '6位验证码',
      forgotCodeEmpty: '请输入验证码',
      forgotCodeWrong: '验证码错误，请重新输入',
      forgotVerify: '验 证',
      forgotBack: '← 返回上一步',
      forgotCountdown: '验证码有效剩余',
      forgotResend: '重新获取验证码',
      forgotNewPwPh: '新密码（至少8位，大小写+数字）',
      forgotConfirmPh: '确认新密码',
      forgotPwInvalid: '密码需至少8位，且包含大小写字母和数字',
      forgotNoMatch: '两次输入的密码不一致',
      forgotSubmit: '重置密码',
      forgotSuccess: '密码重置成功，请使用新密码登录',
      btnLogin: '登 录',
      btnRegister: '注 册',
      agreePrefix: '我同意',
      agreeAnd: '和',
      terms: '服务条款',
      privacy: '隐私政策',
      footer: 'KenyaCoffee © 2026 · 肯尼亚咖啡豆智能种植管理系统',
      ariaPrev: '上一张',
      ariaNext: '下一张',
      /* 验证消息 */
      username: '用户名：3-20位，支持字母/数字/下划线/中文',
      password: '密码：至少8位，须含大写+小写+数字',
      email: '请输入有效的邮箱地址',
      confirm: '两次输入的密码不一致',
      termsRequired: '请同意服务条款和隐私政策',
      loginFail: '用户名或密码错误',
      userExist: '该用户名已被注册',
      emailExist: '该邮箱已被注册',
      emptyFields: '请填写所有必填项',
      emailOk: '邮箱格式正确',
      usernameMin: '用户名至少3位',
      loginAccountInvalid: '请输入有效的用户名或邮箱',
      usernameOk: '用户名格式正确',
      passwordMin: '密码至少8位',
      passwordChar: '须含大写字母+小写字母+数字',
      formatOk: '格式正确',
      usernameMax: '用户名最多20位',
      usernameChar: '仅支持字母/数字/下划线/中文',
      usernameAvailable: '该用户名可用',
      emailAvailable: '该邮箱可用',
      passwordRule: '密码至少8位，须含大写+小写+数字',
      pwdStrong: '密码强度：优秀',
      pwdGood: '密码强度：合格',
      pwdFirst: '请先输入密码',
      confirmOk: '密码一致',
      usernameRequired: '请输入用户名',
      emailRequired: '请输入邮箱地址',
      passwordRequired: '请设置密码',
      confirmRequired: '请确认密码',
      regSuccess: '注册成功！正在进入...',
      welcome: '欢迎使用 KenyaCoffee',
      entering: '正在进入智能种植管理系统',
      loading: '加载中...'
    },
    en: {
      pageTitle: 'Login - Kenya Coffee Intelligent Cultivation System',
      captionBadge: 'Kenya · AA Grade',
      captionTitle: 'Kenya Coffee Beans',
      captionSubtitle: 'Intelligent Cultivation System',
      captionDesc: 'AI precision cultivation platform based on soil and weather data',
      statNum1: '5+', statNum2: 'Multi', statNum3: 'Smart',
      statModel: 'AI Models',
      statData: 'Data Entry',
      statDecision: 'Cultivation Decisions',
      logoSub: 'Smart Cultivation · Precision Decisions · Great Harvest',
      tabLogin: 'Log In',
      tabRegister: 'Sign Up',
      phLoginUsername: 'Username or Email',
      phLoginPassword: 'Password',
      phRegUsername: 'Username',
      phRegEmail: 'Email Address',
      phRegPassword: 'Password (min 8: upper + lower + digit)',
      phRegConfirm: 'Confirm Password',
      rememberMe: 'Remember me',
      forgot: 'Forgot password?',
      forgotModalTitle: 'Reset Password',
      forgotTip: 'Enter your registered email to reset the password',
      forgotStep1: 'Verify Account',
      forgotStep2: 'Code',
      forgotStep3: 'New Password',
      forgotEmailPh: 'Registered email',
      forgotEmailInvalid: 'Please enter a valid email address',
      forgotNotExist: 'Email not registered. Please check and retry',
      forgotGetCode: 'Get Code',
      forgotCodeSent: 'Code sent to',
      forgotCheckMail: ', check your inbox to complete verification',
      forgotSendFail: 'Failed to send code, please try again',
      forgotMailCfg: 'Mail service not configured or unreachable. Deploy to Netlify and configure a sender',
      forgotTooFreq: 'Too frequent, please try again in 60 seconds',
      forgotCodeExpired: 'Code expired, please request a new one',
      forgotCodePh: '6-digit code',
      forgotCodeEmpty: 'Please enter the code',
      forgotCodeWrong: 'Invalid code, please try again',
      forgotVerify: 'Verify',
      forgotBack: '← Back',
      forgotCountdown: 'Code expires in',
      forgotResend: 'Resend code',
      forgotNewPwPh: 'New password (min 8: upper + lower + digit)',
      forgotConfirmPh: 'Confirm new password',
      forgotPwInvalid: 'Password must be 8+ chars with upper, lower and digit',
      forgotNoMatch: 'Passwords do not match',
      forgotSubmit: 'Reset Password',
      forgotSuccess: 'Password reset successfully. Please log in',
      btnLogin: 'Log In',
      btnRegister: 'Sign Up',
      agreePrefix: 'I agree to the',
      agreeAnd: 'and',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      footer: 'KenyaCoffee © 2026 · Kenya Coffee Intelligent Cultivation System',
      ariaPrev: 'Previous',
      ariaNext: 'Next',
      /* Validation messages */
      username: 'Username: 3-20 chars, letters/numbers/underscore/Chinese',
      password: 'Password: min 8 chars, uppercase + lowercase + digit',
      email: 'Please enter a valid email address',
      confirm: 'Passwords do not match',
      termsRequired: 'Please agree to the Terms of Service and Privacy Policy',
      loginFail: 'Incorrect username or password',
      userExist: 'Username already registered',
      emailExist: 'Email already registered',
      emptyFields: 'Please fill in all required fields',
      emailOk: 'Valid email format',
      usernameMin: 'Username must be at least 3 chars',
      loginAccountInvalid: 'Enter a valid username or email',
      usernameOk: 'Valid username format',
      passwordMin: 'Password must be at least 8 chars',
      passwordChar: 'Must include uppercase + lowercase + digit',
      formatOk: 'Valid format',
      usernameMax: 'Username must be at most 20 chars',
      usernameChar: 'Letters/numbers/underscore/Chinese only',
      usernameAvailable: 'Username available',
      emailAvailable: 'Email available',
      passwordRule: 'Password: min 8 chars, uppercase + lowercase + digit',
      pwdStrong: 'Password strength: Strong',
      pwdGood: 'Password strength: Good',
      pwdFirst: 'Please enter a password first',
      confirmOk: 'Passwords match',
      usernameRequired: 'Please enter a username',
      emailRequired: 'Please enter an email address',
      passwordRequired: 'Please set a password',
      confirmRequired: 'Please confirm the password',
      regSuccess: 'Registration successful! Entering...',
      welcome: 'Welcome to KenyaCoffee',
      entering: 'Entering the intelligent cultivation system',
      loading: 'Loading...'
    },
    sw: {
      pageTitle: 'Ingia - Mfumo wa Uzalishaji wa Kahawa ya Kenya',
      captionBadge: 'Kenya · Daraja AA',
      captionTitle: 'Kahawa ya Kenya',
      captionSubtitle: 'Mfumo wa Uzalishaji wa Akili',
      captionDesc: 'Jukwaa la kilimo cha usahihi la AI kulingana na data za udongo na hali ya hewa',
      statNum1: '5+', statNum2: 'Mingi', statNum3: 'Akili',
      statModel: 'Mifumo ya AI',
      statData: 'Weka Data',
      statDecision: 'Maamuzi ya Kilimo',
      logoSub: 'Kilimo cha Akili · Maamuzi Sahihi · Mvuno Mzuri',
      tabLogin: 'Ingia',
      tabRegister: 'Jisajili',
      phLoginUsername: 'Jina la Mtumiaji au Barua Pepe',
      phLoginPassword: 'Nenosiri',
      phRegUsername: 'Jina la Mtumiaji',
      phRegEmail: 'Barua Pepe',
      phRegPassword: 'Nenosiri (angalau 8: herufi kubwa + ndogo + nambari)',
      phRegConfirm: 'Thibitisha Nenosiri',
      rememberMe: 'Nikumbuke',
      forgot: 'Umesahau nenosiri?',
      forgotModalTitle: 'Weka upya Nenosiri',
      forgotTip: 'Weka barua pepe yako iliyosajiliwa ili kuweka upya nenosiri',
      forgotStep1: 'Thibitisha Akaunti',
      forgotStep2: 'Msimbo',
      forgotStep3: 'Nenosiri Jipya',
      forgotEmailPh: 'Barua pepe iliyosajiliwa',
      forgotEmailInvalid: 'Tafadhali weka anwani sahihi ya barua pepe',
      forgotNotExist: 'Barua pepe haijasajiliwa. Tafadhali angalia ujaribu tena',
      forgotGetCode: 'Pata Msimbo',
      forgotCodeSent: 'Msimbo umetumwa kwa',
      forgotCheckMail: ', angalia kikasha chako ili kukamilisha uthibitisho',
      forgotSendFail: 'Imeshindwa kutuma msimbo, tafadhali jaribu tena',
      forgotMailCfg: 'Huduma ya barua pepe haijasanidiwa au haipatikani. Deploy kwa Netlify na usanidi mtoa huduma',
      forgotTooFreq: 'Marudio mengi mno, tafadhali jaribu tena baada ya sekunde 60',
      forgotCodeExpired: 'Msimbo umeisha muda, tafadhali omba mpya',
      forgotCodePh: 'Msimbo wa tarakimu 6',
      forgotCodeEmpty: 'Tafadhali weka msimbo',
      forgotCodeWrong: 'Msimbo si sahihi, tafadhali jaribu tena',
      forgotVerify: 'Thibitisha',
      forgotBack: '← Rudi',
      forgotCountdown: 'Msimbo unaisha muda katika',
      forgotResend: 'Tuma tena',
      forgotNewPwPh: 'Nenosiri jipya (angalau 8: herufi kubwa + ndogo + nambari)',
      forgotConfirmPh: 'Thibitisha nenosiri jipya',
      forgotPwInvalid: 'Nenosiri lazima liwe na angalau 8 vibambo na liwe na herufi kubwa, ndogo na nambari',
      forgotNoMatch: 'Manenosiri hayalingani',
      forgotSubmit: 'Weka upya Nenosiri',
      forgotSuccess: 'Nenosiri limewekwa upya. Tafadhali ingia',
      btnLogin: 'Ingia',
      btnRegister: 'Jisajili',
      agreePrefix: 'Nakubaliana na',
      agreeAnd: 'na',
      terms: 'Masharti ya Huduma',
      privacy: 'Sera ya Faragha',
      footer: 'KenyaCoffee © 2026 · Mfumo wa Uzalishaji wa Kahawa ya Kenya',
      ariaPrev: 'Kabla',
      ariaNext: 'Baada',
      username: 'Jina la mtumiaji: 3-20 vibambo, herufi/nambari/underscore/Kichina',
      password: 'Nenosiri: angalau 8 vibambo, herufi kubwa + ndogo + nambari',
      email: 'Tafadhali weka anwani sahihi ya barua pepe',
      confirm: 'Manenosiri hayalingani',
      termsRequired: 'Tafadhali kubali Masharti ya Huduma na Sera ya Faragha',
      loginFail: 'Jina la mtumiaji au nenosiri si sahihi',
      userExist: 'Jina hili la mtumiaji limeshasajiliwa',
      emailExist: 'Barua pepe hii imeshasajiliwa',
      emptyFields: 'Tafadhali jaza sehemu zote zinazohitajika',
      emailOk: 'Anwani ya barua pepe ni sahihi',
      usernameMin: 'Jina la mtumiaji lazima liwe na angalau 3 vibambo',
      loginAccountInvalid: 'Weka jina sahihi la mtumiaji au barua pepe',
      usernameOk: 'Muundo wa jina la mtumiaji ni sahihi',
      passwordMin: 'Nenosiri lazima liwe na angalau 8 vibambo',
      passwordChar: 'Lazima liwe na herufi kubwa + ndogo + nambari',
      formatOk: 'Muundo sahihi',
      usernameMax: 'Jina la mtumiaji lazima liwe na vibambo 20 au chini',
      usernameChar: 'Herufi/nambari/underscore/Kichina tu',
      usernameAvailable: 'Jina hili la mtumiaji linapatikana',
      emailAvailable: 'Barua pepe hii inapatikana',
      passwordRule: 'Nenosiri: angalau 8 vibambo, herufi kubwa + ndogo + nambari',
      pwdStrong: 'Nguvu ya nenosiri: Imara',
      pwdGood: 'Nguvu ya nenosiri: Nzuri',
      pwdFirst: 'Tafadhali weka nenosiri kwanza',
      confirmOk: 'Manenosiri yalingana',
      usernameRequired: 'Tafadhali weka jina la mtumiaji',
      emailRequired: 'Tafadhali weka barua pepe',
      passwordRequired: 'Tafadhali weka nenosiri',
      confirmRequired: 'Tafadhali thibitisha nenosiri',
      regSuccess: 'Usajili umefanikiwa! Inaingia...',
      welcome: 'Karibu kwenye KenyaCoffee',
      entering: 'Inaingia kwenye mfumo wa uzalishaji wa akili',
      loading: 'Inapakia...'
    }
  },

  /** === 初始化 === */
  init() {
    if (localStorage.getItem('coffee_user_token')) {
      window.location.href = 'index.html';
      return;
    }

    this._createParticles();
    this._bindTabs();
    this._bindPasswordToggle();
    this._bindForms();
    this._startCarousel();
    this._bindCarouselControls();
    this._bindCarouselHover();
    this._bindLiveValidation();
    this._bindLangSwitcher();
    this._bindForgotFlow();
    this._applyLanguage();
  },

  /* ========== 忘记密码（三步验证） ========== */
  _bindForgotFlow() {
    const link = document.getElementById('forgotLink');
    if (link) link.addEventListener('click', (e) => { e.preventDefault(); this._openForgot(); });

    document.getElementById('forgotClose')?.addEventListener('click', () => this._closeForgot());
    document.getElementById('forgotOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'forgotOverlay') this._closeForgot();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('forgotOverlay');
        if (overlay && !overlay.classList.contains('hidden')) this._closeForgot();
      }
    });
    document.getElementById('btnForgotCode')?.addEventListener('click', () => this._sendForgotCode());
    document.getElementById('btnForgotVerify')?.addEventListener('click', () => this._verifyForgotCode());
    document.getElementById('btnForgotSubmit')?.addEventListener('click', () => this._submitForgotReset());
    document.getElementById('btnForgotBack1')?.addEventListener('click', () => this._gotoForgotStep(1));
    document.getElementById('forgotResend')?.addEventListener('click', () => this._sendForgotCode());
  },

  _openForgot() {
    const st = this.forgotState;
    clearInterval(st.timer);
    st.timer = null; st.countdown = 0;
    st.step = 1; st.code = '';

    // 预填登录账号
    document.getElementById('forgotEmail').value = document.getElementById('loginUsername').value.trim() || '';
    document.getElementById('forgotCode').value = '';
    document.getElementById('forgotNewPw').value = '';
    document.getElementById('forgotConfirmPw').value = '';
    this._hideEl('forgotSentInfo');
    this._hideEl('forgotEmailError');
    this._hideEl('forgotCodeError');
    this._hideEl('forgotPwError');
    this._hideEl('forgotTimer');
    this._hideEl('forgotResend');
    this._clearForgotErrors();

    document.getElementById('forgotOverlay').classList.remove('hidden');
    this._gotoForgotStep(1);
    setTimeout(() => document.getElementById('forgotEmail').focus(), 80);
  },

  _closeForgot() {
    clearInterval(this.forgotState.timer);
    this.forgotState.timer = null;
    document.getElementById('forgotOverlay').classList.add('hidden');
  },

  _gotoForgotStep(n) {
    const st = this.forgotState;
    st.step = n;
    document.querySelectorAll('.forgot-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'forgotPanel' + n);
    });
    document.querySelectorAll('#forgotSteps .fstep').forEach(el => {
      el.classList.toggle('active', Number(el.dataset.step) <= n);
    });
    this._clearForgotErrors();
  },

  _clearForgotErrors() {
    document.querySelectorAll('.forgot-panel .input-group.error').forEach(el => el.classList.remove('error'));
  },

  async _sendForgotCode() {
    const st = this.forgotState;
    const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
    const errEl = document.getElementById('forgotEmailError');
    const btn = document.getElementById('btnForgotCode');
    this._hideEl(errEl);

    if (!this.RULES.email.test(email)) {
      this._showError(errEl, this.t('forgotEmailInvalid'));
      this._markError('forgotEmail');
      return;
    }

    const users = this._getUsers();
    const emailOwner = users['__email__' + email];
    if (!emailOwner || !users[emailOwner]) {
      this._showError(errEl, this.t('forgotNotExist'));
      this._markError('forgotEmail');
      return;
    }

    // 调用服务端真实发送验证码邮件
    btn.disabled = true;
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.classList.remove('hidden');

    let res;
    try {
      res = await this._callForgotApi({ action: 'send', email, lang: this.lang });
    } catch (e) {
      res = { ok: false, error: 'NETWORK' };
    }

    btn.disabled = false;
    if (btnText) btnText.style.display = '';
    if (btnLoader) btnLoader.classList.add('hidden');

    if (!res.ok) {
      const msg = (res.error === 'NO_MAIL_CONFIG' || res.error === 'NETWORK')
        ? this.t('forgotMailCfg')
        : (res.error === 'TOO_FREQUENT')
          ? this.t('forgotTooFreq')
          : this.t('forgotSendFail');
      this._showError(errEl, msg);
      return;
    }

    st.email = email;
    const infoEl = document.getElementById('forgotSentInfo');
    infoEl.textContent = this.t('forgotCodeSent') + ' ' + email + this.t('forgotCheckMail');
    infoEl.classList.remove('hidden');
    this._hideEl('forgotCodeError');
    document.getElementById('forgotCode').value = '';
    this._gotoForgotStep(2);
    this._startForgotCountdown();
  },

  _startForgotCountdown() {
    const st = this.forgotState;
    clearInterval(st.timer);
    st.countdown = 60;
    const timerEl = document.getElementById('forgotTimer');
    const resendEl = document.getElementById('forgotResend');
    const update = () => {
      if (st.countdown > 0) {
        timerEl.textContent = this.t('forgotCountdown') + ' ' + st.countdown + 's';
        timerEl.classList.remove('hidden');
        resendEl.classList.add('hidden');
      } else {
        timerEl.classList.add('hidden');
        resendEl.classList.remove('hidden');
      }
    };
    update();
    st.timer = setInterval(() => {
      st.countdown--;
      if (st.countdown <= 0) {
        clearInterval(st.timer);
        st.timer = null;
      }
      update();
    }, 1000);
  },

  async _verifyForgotCode() {
    const st = this.forgotState;
    const input = document.getElementById('forgotCode').value.trim();
    const errEl = document.getElementById('forgotCodeError');
    const btn = document.getElementById('btnForgotVerify');
    this._hideEl(errEl);
    if (!input) {
      this._showError(errEl, this.t('forgotCodeEmpty'));
      this._markError('forgotCode');
      return;
    }

    // 交给服务端校验
    btn.disabled = true;
    let res;
    try {
      res = await this._callForgotApi({ action: 'verify', email: st.email, code: input });
    } catch (e) {
      res = { ok: false, error: 'NETWORK' };
    }
    btn.disabled = false;

    if (!res.ok) {
      const msg = res.error === 'CODE_EXPIRED'
        ? this.t('forgotCodeExpired')
        : (res.error === 'NETWORK')
          ? this.t('forgotMailCfg')
          : this.t('forgotCodeWrong');
      this._showError(errEl, msg);
      this._markError('forgotCode');
      return;
    }

    clearInterval(st.timer);
    st.timer = null;
    this._gotoForgotStep(3);
  },

  _submitForgotReset() {
    const st = this.forgotState;
    const newPw = document.getElementById('forgotNewPw').value;
    const confirmPw = document.getElementById('forgotConfirmPw').value;
    const errEl = document.getElementById('forgotPwError');
    this._hideEl(errEl);

    if (!this.RULES.password.test(newPw)) {
      this._showError(errEl, this.t('forgotPwInvalid'));
      this._markError('forgotNewPw');
      return;
    }
    if (newPw !== confirmPw) {
      this._showError(errEl, this.t('forgotNoMatch'));
      this._markError('forgotConfirmPw');
      return;
    }

    const users = this._getUsers();
    const emailOwner = users['__email__' + st.email];
    const user = emailOwner ? users[emailOwner] : null;
    if (!user) {
      this._showError(errEl, this.t('forgotNotExist'));
      return;
    }
    user.password = this._simpleHash(newPw);
    localStorage.setItem('coffee_registered_users', JSON.stringify(users));

    this._closeForgot();
    this._showToast(this.t('forgotSuccess'), '');
    // 切回登录并预填账号
    document.querySelector('[data-tab="login"]')?.click();
    document.getElementById('loginUsername').value = st.email;
    document.getElementById('loginPassword').value = '';
    document.getElementById('rememberMe').checked = false;
  },

  /** 调用服务端验证码 API（Netlify Function），自动回退 /api 别名 */
  async _callForgotApi(payload) {
    const urls = ['/.netlify/functions/forgot-code', '/api/forgot-code'];
    let lastErr = null;
    for (const url of urls) {
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await resp.json();
        if (data && typeof data.ok === 'boolean') return data;
        lastErr = new Error('invalid response');
      } catch (e) {
        lastErr = e;
      }
    }
    return { ok: false, error: 'NETWORK', detail: lastErr ? String(lastErr.message || lastErr) : '' };
  },

  _hideEl(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  },

  /* ========== 多语言 ========== */
  t(key) {
    const dict = this.LANG[this.lang] || this.LANG.zh;
    return dict[key] !== undefined ? dict[key] : (this.LANG.zh[key] !== undefined ? this.LANG.zh[key] : key);
  },

  _bindLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this._setLang(btn.dataset.lang));
    });
  },

  _setLang(lang) {
    if (lang !== 'zh' && lang !== 'en' && lang !== 'sw') lang = 'zh';
    this.lang = lang;
    localStorage.setItem('coffee_lang', lang);
    this._applyLanguage();
  },

  _applyLanguage() {
    // 文档语言与标题
    const htmlLang = { zh: 'zh-CN', en: 'en', sw: 'sw' };
    document.documentElement.lang = htmlLang[this.lang] || 'zh-CN';
    document.title = this.t('pageTitle');

    // 静态文本
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = this.t(key);
    });

    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });

    // aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', this.t(el.dataset.i18nAria));
    });

    // 按钮激活态
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.lang);
    });

    // 刷新当前输入提示（切换语言后重新校验）
    this._clearAllInputErrors();
  },

  /* ========== 背景粒子 ========== */
  _createParticles() {
    const container = document.getElementById('bgParticles');
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'bg-particle';
      const s = Math.random() * 6 + 3;
      p.style.cssText = `
        width:${s}px;height:${s}px;left:${Math.random()*100}%;top:${Math.random()*100}%;
        animation-duration:${Math.random()*12+10}s;animation-delay:${Math.random()*10}s;
        opacity:${Math.random()*0.5+0.1};
      `;
      container.appendChild(p);
    }
  },

  /* ========== 图片轮播 ========== */
  _startCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length) slides[0].classList.add('active');
    this._runTimer();
  },

  _runTimer() {
    this.carouselTimer = setInterval(() => {
      if (!this.paused) this._goToSlide((this.currentSlide + 1) % this.totalSlides);
    }, this.CAROUSEL_INTERVAL);
  },

  _goToSlide(idx) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    slides[this.currentSlide].classList.remove('active');
    dots[this.currentSlide].classList.remove('active');
    this.currentSlide = idx;
    slides[this.currentSlide].classList.add('active');
    dots[this.currentSlide].classList.add('active');
  },

  _bindCarouselControls() {
    document.querySelectorAll('.dot').forEach(d =>
      d.addEventListener('click', () => {
        clearInterval(this.carouselTimer);
        this._goToSlide(parseInt(d.dataset.idx));
        this._runTimer();
      })
    );
    document.getElementById('carouselPrev').addEventListener('click', () => {
      clearInterval(this.carouselTimer);
      this._goToSlide((this.currentSlide - 1 + this.totalSlides) % this.totalSlides);
      this._runTimer();
    });
    document.getElementById('carouselNext').addEventListener('click', () => {
      clearInterval(this.carouselTimer);
      this._goToSlide((this.currentSlide + 1) % this.totalSlides);
      this._runTimer();
    });
  },

  _bindCarouselHover() {
    const el = document.getElementById('authCarousel');
    el.addEventListener('mouseenter', () => { this.paused = true; });
    el.addEventListener('mouseleave', () => { this.paused = false; });
  },

  /* ========== Tab切换 ========== */
  _bindTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const wrap = document.querySelector('.auth-tabs');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginErr = document.getElementById('loginError');
    const regErr = document.getElementById('registerError');

    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        const target = t.dataset.tab;
        if (target === 'register') {
          wrap.classList.add('register-active');
          loginForm.classList.remove('active');
          registerForm.classList.add('active');
        } else {
          wrap.classList.remove('register-active');
          registerForm.classList.remove('active');
          loginForm.classList.add('active');
        }
        loginErr.classList.add('hidden');
        regErr.classList.add('hidden');
        this._clearAllInputErrors();
      });
    });
  },

  /* ========== 密码可见切换 ========== */
  _bindPasswordToggle() {
    document.querySelectorAll('.toggle-pw').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.classList.toggle('visible');
      });
    });
  },

  /* ========== 表单绑定 ========== */
  _bindForms() {
    document.getElementById('loginForm').addEventListener('submit', e => {
      e.preventDefault();
      this._handleLogin();
    });
    document.getElementById('registerForm').addEventListener('submit', e => {
      e.preventDefault();
      this._handleRegister();
    });
  },

  /* ========== 实时校验（输入时即时提示） ========== */
  _bindLiveValidation() {
    // 登录：用户名或邮箱
    this._bindField('loginUsername', (val) => {
      if (!val) return null;
      if (this.RULES.email.test(val)) return { ok: true, msg: this.t('emailOk') };
      if (val.length < 3) return { ok: false, msg: this.t('usernameMin') };
      if (!this.RULES.username.test(val)) return { ok: false, msg: this.t('loginAccountInvalid') };
      return { ok: true, msg: this.t('usernameOk') };
    });

    // 登录：密码
    this._bindField('loginPassword', (val) => {
      if (!val) return null;
      if (val.length < 8) return { ok: false, msg: this.t('passwordMin') };
      if (!this.RULES.password.test(val)) return { ok: false, msg: this.t('passwordChar') };
      return { ok: true, msg: this.t('formatOk') };
    });

    // 注册：用户名
    this._bindField('regUsername', (val) => {
      if (!val) return null;
      if (val.length < 3) return { ok: false, msg: this.t('usernameMin') };
      if (val.length > 20) return { ok: false, msg: this.t('usernameMax') };
      if (!this.RULES.username.test(val)) return { ok: false, msg: this.t('usernameChar') };
      const users = this._getUsers();
      if (users[val.toLowerCase()]) return { ok: false, msg: this.t('userExist') };
      return { ok: true, msg: this.t('usernameAvailable') };
    });

    // 注册：邮箱
    this._bindField('regEmail', (val) => {
      if (!val) return null;
      if (!this.RULES.email.test(val)) return { ok: false, msg: this.t('email') };
      const users = this._getUsers();
      if (users['__email__' + val.toLowerCase()]) return { ok: false, msg: this.t('emailExist') };
      return { ok: true, msg: this.t('emailAvailable') };
    });

    // 注册：密码
    this._bindField('regPassword', (val) => {
      if (!val) return { _strength: 0, msg: null };
      let score = 0;
      if (val.length >= 8) score++;
      if (/[a-z]/.test(val)) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/\d/.test(val)) score++;
      if (/[^a-zA-Z0-9]/.test(val)) score++;

      this._updateStrength(val, score);

      if (score < 3) return { _strength: score, ok: false, msg: this.t('passwordRule') };
      return { _strength: score, ok: true, msg: score >= 4 ? this.t('pwdStrong') : this.t('pwdGood') };
    });

    // 注册：确认密码
    this._bindField('regConfirm', (val) => {
      const pwd = document.getElementById('regPassword').value;
      if (!val) return null;
      if (!pwd) return { ok: false, msg: this.t('pwdFirst') };
      if (val !== pwd) return { ok: false, msg: this.t('confirm') };
      return { ok: true, msg: this.t('confirmOk') };
    });
  },

  /** 绑定单个字段实时校验 */
  _bindField(inputId, validateFn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const tipId = 'tip' + inputId.charAt(0).toUpperCase() + inputId.slice(1);
    const tipEl = document.getElementById(tipId);
    if (!tipEl) return;

    let timer = null;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const val = input.value.trim();
        const result = validateFn(val);

        // 空值：清除
        if (!result || result.msg === null) {
          tipEl.className = 'input-tip hidden';
          tipEl.textContent = '';
          input.closest('.input-group')?.classList.remove('error');
          if (inputId === 'regPassword') {
            this._updateStrength('', 0);
          }
          return;
        }

        tipEl.textContent = result.msg;
        tipEl.className = 'input-tip visible ' + (result.ok ? 'success' : 'error');

        if (result.ok) {
          input.closest('.input-group')?.classList.remove('error');
          input.closest('.input-group')?.classList.add('success');
        } else {
          input.closest('.input-group')?.classList.add('error');
          input.closest('.input-group')?.classList.remove('success');
        }
      }, 300);
    });

    // 失焦时立即校验（不延迟）
    input.addEventListener('blur', () => {
      clearTimeout(timer);
      const val = input.value.trim();
      if (!val) {
        tipEl.className = 'input-tip hidden';
        tipEl.textContent = '';
        input.closest('.input-group')?.classList.remove('error', 'success');
        if (inputId === 'regPassword') this._updateStrength('', 0);
        return;
      }
      const result = validateFn(val);
      if (result && result.msg !== null) {
        tipEl.textContent = result.msg;
        tipEl.className = 'input-tip visible ' + (result.ok ? 'success' : 'error');
        if (result.ok) {
          input.closest('.input-group')?.classList.remove('error');
          input.closest('.input-group')?.classList.add('success');
        } else {
          input.closest('.input-group')?.classList.add('error');
          input.closest('.input-group')?.classList.remove('success');
        }
      }
    });
  },

  /** 密码强度条 */
  _updateStrength(val, score) {
    let bar = document.getElementById('pwdStrengthBar');
    if (!bar && val) {
      // 动态创建强度条
      const target = document.getElementById('regPassword');
      if (!target) return;
      const div = document.createElement('div');
      div.className = 'pwd-strength visible';
      div.id = 'pwdStrengthBar';
      div.innerHTML = '<span class="pwd-strength-bar" id="bar1"></span><span class="pwd-strength-bar" id="bar2"></span><span class="pwd-strength-bar" id="bar3"></span>';
      target.closest('.input-group').after(div);
      bar = div;
    }
    if (!val) {
      if (bar) bar.classList.remove('visible');
      return;
    }
    if (bar) bar.classList.add('visible');

    const levels = ['low', 'low', 'medium', 'high', 'high'];
    ['bar1', 'bar2', 'bar3'].forEach((id, i) => {
      const span = document.getElementById(id);
      if (span) {
        span.className = 'pwd-strength-bar';
        if (i < score) span.classList.add(levels[score - 1]);
      }
    });
  },

  _clearAllInputErrors() {
    document.querySelectorAll('.input-group.error, .input-group.success').forEach(g => {
      g.classList.remove('error', 'success');
    });
    document.querySelectorAll('.input-tip').forEach(t => { t.className = 'input-tip hidden'; t.textContent = ''; });
    const bar = document.getElementById('pwdStrengthBar');
    if (bar) bar.classList.remove('visible');
  },

  /* ========== 用户存储 ========== */
  _getUsers() {
    try {
      return JSON.parse(localStorage.getItem('coffee_registered_users')) || {};
    } catch { return {}; }
  },

  _saveUser(username, email, passwordHash) {
    const users = this._getUsers();
    users[username.toLowerCase()] = { username, email, password: passwordHash, registeredAt: new Date().toISOString() };
    // 同时建立邮箱索引防重复
    if (email) {
      users['__email__' + email.toLowerCase()] = username.toLowerCase();
    }
    localStorage.setItem('coffee_registered_users', JSON.stringify(users));
  },

  _simpleHash(str) {
    // 简单的哈希（非安全用途，仅避免明文存储）
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
  },

  /* =============================================
     登录 - 完整正确性验证
     ============================================= */
  _handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;
    const errorEl = document.getElementById('loginError');
    const btn = document.getElementById('btnLogin');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    // 1. 非空校验
    if (!username || !password) {
      this._showError(errorEl, this.t('emptyFields'));
      if (!username) this._markError('loginUsername');
      if (!password) this._markError('loginPassword');
      return;
    }

    // 2. 用户名或邮箱格式校验
    const isEmail = this.RULES.email.test(username);
    if (!isEmail && !this.RULES.username.test(username)) {
      this._showError(errorEl, this.t('loginAccountInvalid'));
      this._markError('loginUsername');
      return;
    }

    // 3. 密码格式校验
    if (!this.RULES.password.test(password)) {
      this._showError(errorEl, this.t('password'));
      this._markError('loginPassword');
      return;
    }

    // 4. 加载状态
    errorEl.classList.add('hidden');
    this._clearAllInputErrors();
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.classList.remove('hidden');

    // 模拟网络延迟后校验
    setTimeout(() => {
      // 5. 查找用户（支持用户名或邮箱）
      const users = this._getUsers();
      const key = username.toLowerCase();
      let user = users[key];
      if (!user && isEmail) {
        const emailOwner = users['__email__' + key];
        if (emailOwner) user = users[emailOwner];
      }
      const hash = this._simpleHash(password);

      if (!user || user.password !== hash) {
        btn.disabled = false;
        btnText.style.display = '';
        btnLoader.classList.add('hidden');
        this._showError(errorEl, this.t('loginFail'));
        this._markError('loginUsername');
        this._markError('loginPassword');
        return;
      }

      // 6. 登录成功
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('coffee_user_token', 'auth_' + Date.now());
      storage.setItem('coffee_user_data', JSON.stringify({
        username: user.username,
        email: user.email,
        loggedAt: new Date().toISOString()
      }));

      btn.disabled = false;
      btnText.style.display = '';
      btnLoader.classList.add('hidden');

      this._showSuccess(() => { window.location.href = 'index.html'; });
    }, 600);
  },

  /* =============================================
     注册 - 完整正确性验证
     ============================================= */
  async _handleRegister() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const errorEl = document.getElementById('registerError');
    const btn = document.getElementById('btnRegister');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    // === 逐项验证 ===

    // 1. 用户名非空
    if (!username) {
      this._showError(errorEl, this.t('usernameRequired'));
      this._markError('regUsername');
      return;
    }
    // 2. 用户名格式
    if (!this.RULES.username.test(username)) {
      this._showError(errorEl, this.t('username'));
      this._markError('regUsername');
      return;
    }
    // 3. 邮箱非空
    if (!email) {
      this._showError(errorEl, this.t('emailRequired'));
      this._markError('regEmail');
      return;
    }
    // 4. 邮箱格式
    if (!this.RULES.email.test(email)) {
      this._showError(errorEl, this.t('email'));
      this._markError('regEmail');
      return;
    }
    // 5. 密码非空
    if (!password) {
      this._showError(errorEl, this.t('passwordRequired'));
      this._markError('regPassword');
      return;
    }
    // 6. 密码强度
    if (!this.RULES.password.test(password)) {
      this._showError(errorEl, this.t('password'));
      this._markError('regPassword');
      return;
    }
    // 7. 确认密码
    if (!confirm) {
      this._showError(errorEl, this.t('confirmRequired'));
      this._markError('regConfirm');
      return;
    }
    if (password !== confirm) {
      this._showError(errorEl, this.t('confirm'));
      this._markError('regConfirm');
      return;
    }
    // 8. 条款
    if (!agreeTerms) {
      this._showError(errorEl, this.t('termsRequired'));
      return;
    }

    // 9. 查重
    const users = this._getUsers();
    if (users[username.toLowerCase()]) {
      this._showError(errorEl, this.t('userExist'));
      this._markError('regUsername');
      return;
    }
    if (users['__email__' + email.toLowerCase()]) {
      this._showError(errorEl, this.t('emailExist'));
      this._markError('regEmail');
      return;
    }

    // 加载
    errorEl.classList.add('hidden');
    this._clearAllInputErrors();
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.classList.remove('hidden');

    // 保存到本地
    this._saveUser(username, email, this._simpleHash(password));

    // 构建API数据
    const payload = {
      username: username,
      email: email,
      register_time: new Date().toISOString(),
      platform: 'KenyaCoffee智能种植系统',
      user_agent: navigator.userAgent
    };

    // POST注册
    try {
      await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('云端注册不可用，已使用本地模式:', err.message);
    }

    // 自动登录
    localStorage.setItem('coffee_user_token', 'auth_' + Date.now());
    localStorage.setItem('coffee_user_data', JSON.stringify({
      username: username, email: email, registeredAt: new Date().toISOString()
    }));

    btn.disabled = false;
    btnText.style.display = '';
    btnLoader.classList.add('hidden');

    this._showToast(this.t('regSuccess'), '');
    this._showSuccess(() => { window.location.href = 'index.html'; });
  },

  /* ========== 工具方法 ========== */

  _markError(id) {
    const input = document.getElementById(id);
    if (input) input.closest('.input-group')?.classList.add('error');
  },

  _showError(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'errorShake 0.4s ease';
  },

  _shakeInput(id) {
    const input = document.getElementById(id);
    if (!input) return;
    input.style.animation = 'none';
    input.offsetHeight;
    input.style.animation = 'errorShake 0.4s ease';
    input.focus();
  },

  _showToast(msg, type) {
    const container = document.getElementById('authToast');
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3400);
  },

  _showSuccess(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.innerHTML = `
      <div class="success-icon">☕</div>
      <div class="success-text">${this.t('welcome')}</div>
      <div class="success-sub">
        ${this.t('entering')}
        <span class="success-dots"><span></span><span></span><span></span></span>
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.35s ease';
      setTimeout(() => { overlay.remove(); if (callback) callback(); }, 350);
    }, 1200);
  }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());
