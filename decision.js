/* ============================================
   肯尼亚咖啡豆种植系统 - 决策引擎
   基于土壤+气象数据 → 施肥/修剪/灌溉决策
   支持中英双语（与登录页共用 coffee_lang）
   ============================================ */

const CoffeeDecisionEngine = {

  lang: localStorage.getItem('coffee_lang') || 'zh',

  /** 翻译方法：key → 当前语言文本，支持 {param} 替换 */
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

  /** 优先级显示文本（内部优先级保持中文用于CSS类与逻辑判断） */
  _priorityText(p) {
    return this.t(p === '高' ? 'pHigh' : p === '中' ? 'pMedium' : 'pLow');
  },

  /** 评估土壤pH */
  _evalPH(ph) {
    if (ph < 4.5) return { level: 'bad', text: this.t('phTooAcid'), advice: this.t('phTooAcidAdvice') };
    if (ph < 5.0) return { level: 'warning', text: this.t('phSlightlyAcid'), advice: this.t('phSlightlyAcidAdvice') };
    if (ph <= 6.5) return { level: 'good', text: this.t('phOptimal'), advice: this.t('phOptimalAdvice') };
    if (ph <= 7.0) return { level: 'warning', text: this.t('phSlightlyAlkaline'), advice: this.t('phSlightlyAlkalineAdvice') };
    return { level: 'bad', text: this.t('phTooAlkaline'), advice: this.t('phTooAlkalineAdvice') };
  },

  _evalOrganic(organic) {
    if (organic < 1.5) return { level: 'bad', text: this.t('orgPoor'), advice: this.t('orgPoorAdvice') };
    if (organic < 2.5) return { level: 'warning', text: this.t('orgLow'), advice: this.t('orgLowAdvice') };
    if (organic <= 6) return { level: 'good', text: this.t('orgGood'), advice: this.t('orgGoodAdvice') };
    return { level: 'good', text: this.t('orgRich'), advice: this.t('orgRichAdvice') };
  },

  _evalNutrient(nameKey, value, low, medium, high) {
    const name = this.t(nameKey);
    if (value < low) return {
      level: 'bad', text: this.t('nutDeficient'),
      advice: this.t('nutDeficientAdvice', { name: name, min: Math.round((low-value)*0.8), max: Math.round((low-value)*1.2) })
    };
    if (value < medium) return {
      level: 'warning', text: this.t('nutLow'),
      advice: this.t('nutLowAdvice', { name: name, min: Math.round((medium-value)*0.5), max: Math.round((medium-value)*0.8) })
    };
    if (value <= high) return { level: 'good', text: this.t('nutSufficient') };
    return { level: 'warning', text: this.t('nutHigh'), advice: this.t('nutHighAdvice', { name: name }) };
  },

  _evalTemperature(temp) {
    if (temp < 10) return { level: 'bad', text: this.t('tempTooLow'), advice: this.t('tempTooLowAdvice') };
    if (temp < 15) return { level: 'warning', text: this.t('tempLow'), advice: this.t('tempLowAdvice') };
    if (temp <= 24) return { level: 'good', text: this.t('tempOptimal'), advice: this.t('tempOptimalAdvice') };
    if (temp <= 28) return { level: 'warning', text: this.t('tempHigh'), advice: this.t('tempHighAdvice') };
    return { level: 'bad', text: this.t('tempTooHigh'), advice: this.t('tempTooHighAdvice') };
  },

  _evalRainfall(rain) {
    if (rain < 30) return { level: 'bad', text: this.t('rainExtremeDrought'), advice: this.t('rainExtremeDroughtAdvice') };
    if (rain < 60) return { level: 'warning', text: this.t('rainDrought'), advice: this.t('rainDroughtAdvice') };
    if (rain <= 200) return { level: 'good', text: this.t('rainOptimal'), advice: this.t('rainOptimalAdvice') };
    if (rain <= 300) return { level: 'warning', text: this.t('rainExcess'), advice: this.t('rainExcessAdvice') };
    return { level: 'bad', text: this.t('rainTooMuch'), advice: this.t('rainTooMuchAdvice') };
  },

  _evalMoisture(moisture) {
    if (moisture < 20) return { level: 'bad', text: this.t('moistDrought') };
    if (moisture < 35) return { level: 'warning', text: this.t('moistLow') };
    if (moisture <= 70) return { level: 'good', text: this.t('moistOptimal') };
    if (moisture <= 85) return { level: 'warning', text: this.t('moistHigh') };
    return { level: 'bad', text: this.t('moistWet') };
  },

  _evalSunlight(sun) {
    if (sun < 4) return { level: 'warning', text: this.t('sunInsufficient'), advice: this.t('sunInsufficientAdvice') };
    if (sun <= 9) return { level: 'good', text: this.t('sunOptimal'), advice: this.t('sunOptimalAdvice') };
    return { level: 'warning', text: this.t('sunStrong'), advice: this.t('sunStrongAdvice') };
  },

  _evalHumidity(hum) {
    if (hum < 40) return { level: 'warning', text: this.t('humLow') };
    if (hum <= 85) return { level: 'good', text: this.t('humOptimal') };
    return { level: 'warning', text: this.t('humHigh'), advice: this.t('humHighAdvice') };
  },

  _evalAltitude(alt) {
    if (alt < 1000) return { level: 'warning', text: this.t('altLow'), advice: this.t('altLowAdvice') };
    if (alt <= 2000) return { level: 'good', text: this.t('altBest'), advice: this.t('altBestAdvice') };
    return { level: 'good', text: this.t('altHigh'), advice: this.t('altHighAdvice') };
  },

  /** 核心API：根据全部数据生成决策 */
  generate(data) {
    const results = {
      summary: [],
      fertilizer: [],
      pruning: [],
      irrigation: [],
      warnings: [],
      allEvaluations: {}
    };

    // 土壤评估
    const phEval = this._evalPH(data.soilPH);
    const orgEval = this._evalOrganic(data.soilOrganic);
    const nEval = this._evalNutrient('nName', data.soilN, 50, 100, 200);
    const pEval = this._evalNutrient('pName', data.soilP, 10, 25, 60);
    const kEval = this._evalNutrient('kName', data.soilK, 80, 150, 300);
    const moistEval = this._evalMoisture(data.soilMoisture);

    // 气象评估
    const tempEval = this._evalTemperature(data.avgTemp);
    const rainEval = this._evalRainfall(data.monthlyRain);
    const sunEval = this._evalSunlight(data.sunHours);
    const humEval = this._evalHumidity(data.humidity);
    const altEval = this._evalAltitude(data.altitude);

    results.allEvaluations = {
      ph: phEval, organic: orgEval,
      n: nEval, p: pEval, k: kEval,
      moisture: moistEval, temperature: tempEval,
      rainfall: rainEval, sunlight: sunEval,
      humidity: humEval, altitude: altEval
    };

    // === 施肥决策 ===
    // pH调节优先
    if (phEval.level === 'bad' || phEval.level === 'warning') {
      results.fertilizer.push({
        type: this.t('fertSoilImprove'),
        product: phEval.level === 'bad' ? this.t('fertLimeCaCO3') : this.t('fertLimeOrganic'),
        amount: data.soilPH < 4.5 ? this.t('fertLimeAmountHigh') : this.t('fertLimeAmountLow'),
        timing: this.t('fertLimeTiming'),
        priority: '高',
        reason: this.t('reasonPh', { ph: data.soilPH, text: phEval.text }),
        detail: phEval.advice
      });
    }

    // 氮肥
    if (nEval.level !== 'good') {
      results.fertilizer.push({
        type: this.t('fertNitrogen'),
        product: data.soilPH < 5 ? this.t('fertAmmoniumSulfate') : this.t('fertUrea'),
        amount: nEval.level === 'bad' ? this.t('fertNAmountBad') : this.t('fertNAmountGood'),
        timing: this.t('fertNTiming'),
        priority: nEval.level === 'bad' ? '高' : '中',
        reason: this.t('reasonN', { n: data.soilN, text: nEval.text }),
        detail: nEval.advice || ''
      });
    }

    // 磷肥
    if (pEval.level !== 'good') {
      results.fertilizer.push({
        type: this.t('fertPhosphorus'),
        product: this.t('fertSuperphosphate'),
        amount: pEval.level === 'bad' ? this.t('fertPAmountBad') : this.t('fertPAmountGood'),
        timing: this.t('fertPTiming'),
        priority: pEval.level === 'bad' ? '高' : '中',
        reason: this.t('reasonP', { p: data.soilP, text: pEval.text }),
        detail: pEval.advice || ''
      });
    }

    // 钾肥
    if (kEval.level !== 'good') {
      results.fertilizer.push({
        type: this.t('fertPotassium'),
        product: this.t('fertPotassiumSulfate'),
        amount: kEval.level === 'bad' ? this.t('fertKAmountBad') : this.t('fertKAmountGood'),
        timing: this.t('fertKTiming'),
        priority: kEval.level === 'bad' ? '高' : '中',
        reason: this.t('reasonK', { k: data.soilK, text: kEval.text }),
        detail: kEval.advice || ''
      });
    }

    // 有机肥
    if (orgEval.level !== 'good') {
      results.fertilizer.push({
        type: this.t('fertOrganic'),
        product: this.t('fertOrganicProduct'),
        amount: orgEval.level === 'bad' ? this.t('fertOrgAmountBad') : this.t('fertOrgAmountGood'),
        timing: this.t('fertOrgTiming'),
        priority: '中',
        reason: this.t('reasonOrg', { org: data.soilOrganic, text: orgEval.text }),
        detail: orgEval.advice || ''
      });
    } else {
      results.fertilizer.push({
        type: this.t('fertOrganicMaintain'),
        product: this.t('fertOrgMaintProduct'),
        amount: this.t('fertOrgMaintAmount'),
        timing: this.t('fertOrgMaintTiming'),
        priority: '低',
        reason: this.t('reasonOrgMaint'),
        detail: ''
      });
    }

    // === 修剪决策 ===
    const month = data.currentMonth;
    const treeAge = data.treeAge;

    // 肯尼亚咖啡修剪季节
    // 主修剪期：1-3月（收获后）
    // 次修剪期：6-8月
    const isMainPruningSeason = month >= 1 && month <= 3;
    const isSecondaryPruningSeason = month >= 6 && month <= 8;

    if (treeAge < 2) {
      results.pruning.push({
        type: this.t('pruneYoung'),
        timing: this.t('pruneYoungTiming'),
        season: this.t('pruneYoungSeason'),
        method: this.t('pruneYoungMethod'),
        priority: '中',
        detail: this.t('pruneYoungDetail')
      });
    } else if (treeAge >= 2 && treeAge <= 6) {
      if (isMainPruningSeason) {
        results.pruning.push({
          type: this.t('pruneProductive'),
          timing: this.t('pruneProductiveTiming'),
          season: this.t('pruneProductiveSeason'),
          method: this.t('pruneProductiveMethod'),
          priority: '高',
          detail: this.t('pruneProductiveDetail')
        });
      } else if (isSecondaryPruningSeason) {
        results.pruning.push({
          type: this.t('pruneSecondary'),
          timing: this.t('pruneSecondaryTiming'),
          season: this.t('pruneSecondarySeason'),
          method: this.t('pruneSecondaryMethod'),
          priority: '中',
          detail: this.t('pruneSecondaryDetail')
        });
      } else {
        results.pruning.push({
          type: this.t('prunePlanned'),
          timing: this.t('prunePlannedTiming', { window: month < 6 ? this.t('windowSecondary') : this.t('windowMain') }),
          season: this.t('prunePlannedSeason', { season: month < 6 ? this.t('nextWindowSecondary') : this.t('nextWindowMain') }),
          method: this.t('prunePlannedMethod'),
          priority: '低',
          detail: this.t('prunePlannedDetail')
        });
      }
    } else {
      // treeAge > 6
      if (isMainPruningSeason) {
        results.pruning.push({
          type: this.t('pruneOldRenew'),
          timing: this.t('pruneOldRenewTiming'),
          season: this.t('pruneOldRenewSeason'),
          method: this.t('pruneOldRenewMethod'),
          priority: '高',
          detail: this.t('pruneOldRenewDetail', { age: treeAge })
        });
      } else if (isSecondaryPruningSeason) {
        results.pruning.push({
          type: this.t('pruneOldMaintain'),
          timing: this.t('pruneOldMaintainTiming'),
          season: this.t('pruneOldMaintainSeason'),
          method: this.t('pruneOldMaintainMethod'),
          priority: '中',
          detail: this.t('pruneOldMaintainDetail', { age: treeAge })
        });
      } else {
        results.pruning.push({
          type: this.t('pruneOldPlanned'),
          timing: this.t('pruneOldPlannedTiming'),
          season: this.t('pruneOldPlannedSeason'),
          method: this.t('pruneOldPlannedMethod'),
          priority: '低',
          detail: this.t('pruneOldPlannedDetail', { age: treeAge })
        });
      }
    }

    // === 灌溉建议 ===
    if (data.monthlyRain < 30) {
      results.irrigation.push({
        urgency: this.t('irrImmediate'),
        method: this.t('irrDripSprinkler'),
        amount: this.t('irrAmt1'),
        frequency: this.t('irrFreq1'),
        detail: this.t('irrDetail1')
      });
    } else if (data.monthlyRain < 60) {
      results.irrigation.push({
        urgency: this.t('irrSoon'),
        method: this.t('irrDrip'),
        amount: this.t('irrAmt2'),
        frequency: this.t('irrFreq2'),
        detail: this.t('irrDetail2')
      });
    } else if (data.monthlyRain > 200 && data.monthlyRain <= 300) {
      results.irrigation.push({
        urgency: this.t('irrCaution'),
        method: this.t('irrDrainage'),
        amount: this.t('irrNone'),
        frequency: this.t('irrFreqDrain'),
        detail: this.t('irrDetail3')
      });
    } else {
      results.irrigation.push({
        urgency: this.t('irrNormal'),
        method: this.t('irrNaturalRain'),
        amount: this.t('irrMonitor'),
        frequency: this.t('irrAsNeeded'),
        detail: this.t('irrDetail4')
      });
    }

    // === 综合警告 ===
    if (tempEval.level === 'bad') {
      results.warnings.push({ level: 'bad', msg: this.t('warnTempBad', { text: tempEval.text, temp: data.avgTemp, advice: tempEval.advice }) });
    }
    if (data.humidity > 85) {
      results.warnings.push({ level: 'warning', msg: this.t('warnHumidityHigh', { hum: data.humidity }) });
    }
    if (data.soilMoisture > 85) {
      results.warnings.push({ level: 'warning', msg: this.t('warnSoilWet', { moist: data.soilMoisture }) });
    }
    if (data.altitude < 1000) {
      results.warnings.push({ level: 'info', msg: this.t('warnLowAltitude', { alt: data.altitude }) });
    }

    // 病虫害风险预警
    if (data.humidity > 85 && data.avgTemp >= 15 && data.avgTemp <= 24) {
      results.warnings.push({
        level: 'warning',
        msg: this.t('warnDiseaseRisk')
      });
    }

    return results;
  },

  /** 生成HTML格式的决策报告 */
  renderHTML(data, results) {
    const ev = results.allEvaluations;

    // 状态标签映射
    const statusTag = (evalObj) => {
      const cls = evalObj.level === 'good' ? 'good' :
                  evalObj.level === 'warning' ? 'warning' : 'bad';
      return `<span class="stat-status ${cls}">${evalObj.text}</span>`;
    };

    // 数据概览条
    const overviewRows = [
      [this.t('rLabelPH'), `${data.soilPH}`, ev.ph],
      [this.t('rLabelOrganic'), `${data.soilOrganic}%`, ev.organic],
      [this.t('rLabelN'), `${data.soilN}mg/kg`, ev.n],
      [this.t('rLabelP'), `${data.soilP}mg/kg`, ev.p],
      [this.t('rLabelK'), `${data.soilK}mg/kg`, ev.k],
      [this.t('rLabelMoisture'), `${data.soilMoisture}%`, ev.moisture],
      [this.t('rLabelTemp'), `${data.avgTemp}°C`, ev.temperature],
      [this.t('rLabelRain'), `${data.monthlyRain}mm`, ev.rainfall],
      [this.t('rLabelSun'), `${data.sunHours}h/d`, ev.sunlight],
      [this.t('rLabelHumidity'), `${data.humidity}%`, ev.humidity],
      [this.t('rLabelAltitude'), `${data.altitude}m`, ev.altitude]
    ];
    let html = `
    <div class="card decision-block">
      <div class="card-header"><h3><span class="dh-ico">${this.t('rIcoOverview')}</span>${this.t('rTitleOverviewTxt')}</h3></div>
      <div class="card-body card-body--flush">
        <table class="decision-table">
          <thead><tr>
            <th>${this.t('rThMetric')}</th><th>${this.t('rThValue')}</th><th>${this.t('rThStatus')}</th><th>${this.t('rThAdvice')}</th>
          </tr></thead>
          <tbody>`;
    overviewRows.forEach(r => {
      html += `<tr>
        <td class="dt-metric">${r[0]}</td>
        <td class="dt-value">${r[1]}</td>
        <td>${statusTag(r[2])}</td>
        <td class="dt-advice">${r[2].advice || '—'}</td>
      </tr>`;
    });
    html += `</tbody></table></div></div>`;

    // 施肥建议
    if (results.fertilizer.length > 0) {
      html += `
      <div class="card decision-block">
        <div class="card-header"><h3><span class="dh-ico">${this.t('rIcoFertilizer')}</span>${this.t('rTitleFertilizerTxt')}</h3></div>
        <div class="card-body card-body--flush">
          <table class="decision-table">
            <thead><tr><th>${this.t('rThType')}</th><th>${this.t('rThProduct')}</th><th>${this.t('rThAmount')}</th><th>${this.t('rThTiming')}</th><th>${this.t('rThPriority')}</th><th>${this.t('rThReason')}</th></tr></thead>
            <tbody>`;
      results.fertilizer.forEach(f => {
        html += `<tr>
          <td class="dt-metric">${f.type}</td>
          <td>${f.product}</td>
          <td>${f.amount}</td>
          <td>${f.timing}</td>
          <td><span class="decision-tag ${f.priority}">${this._priorityText(f.priority)}</span></td>
          <td class="dt-advice">${f.reason}</td>
        </tr>`;
        if (f.detail) {
          html += `<tr class="dt-detail-row"><td colspan="6"><div class="dt-detail">${this.t('rNoteIcon')}<span>${f.detail}</span></div></td></tr>`;
        }
      });
      html += `</tbody></table></div></div>`;
    }

    // 修剪建议
    if (results.pruning.length > 0) {
      html += `
      <div class="card decision-block">
        <div class="card-header"><h3><span class="dh-ico">${this.t('rIcoPruning')}</span>${this.t('rTitlePruningTxt')}</h3></div>
        <div class="card-body"><div class="decision-list">`;
      results.pruning.forEach(p => {
        const tagColor = p.priority === '高' ? '立即' : p.priority === '中' ? '近期' : '计划';
        html += `
          <div class="decision-item">
            <div class="di-head">
              <span class="di-icon">${this.t('rIcoPruning')}</span>
              <div class="di-head-main">
                <div class="di-title">${p.type}</div>
                <div class="di-tags"><span class="decision-tag ${tagColor}">${this._priorityText(p.priority)}${this.t('rPrioritySuffix')}</span></div>
              </div>
            </div>
            <div class="di-meta">
              <span class="di-chip">${this.t('rPruneTime')}${p.timing}</span>
              <span class="di-chip">${this.t('rSeason')}${p.season}</span>
            </div>
            <p class="di-method">${this.t('rMethodIcon')}${p.method}</p>
            <p class="di-detail">${this.t('rNoteIcon')}${p.detail}</p>
          </div>`;
      });
      html += `</div></div></div>`;
    }

    // 灌溉建议
    if (results.irrigation.length > 0) {
      html += `
      <div class="card decision-block">
        <div class="card-header"><h3><span class="dh-ico">${this.t('rIcoIrrigation')}</span>${this.t('rTitleIrrigationTxt')}</h3></div>
        <div class="card-body"><div class="decision-list">`;
      results.irrigation.forEach(i => {
        const urTag = (i.urgency === this.t('irrImmediate')) ? '高' :
                      (i.urgency === this.t('irrSoon') || i.urgency === this.t('irrCaution')) ? '中' : '低';
        html += `
          <div class="decision-item">
            <div class="di-head">
              <span class="di-icon">${this.t('rIcoIrrigation')}</span>
              <div class="di-head-main"><div class="di-title">${i.urgency}</div></div>
              <span class="decision-tag ${urTag}">${this._priorityText(urTag === '高' ? '高' : urTag === '中' ? '中' : '低')}${this.t('rPrioritySuffix')}</span>
            </div>
            <div class="di-grid">
              <div class="di-cell"><span class="di-cell-label">${this.t('rIrrMethod')}</span><span class="di-cell-val">${i.method}</span></div>
              <div class="di-cell"><span class="di-cell-label">${this.t('rIrrAmount')}</span><span class="di-cell-val">${i.amount}</span></div>
              <div class="di-cell"><span class="di-cell-label">${this.t('rIrrFreq')}</span><span class="di-cell-val">${i.frequency}</span></div>
            </div>
            <p class="di-detail">${this.t('rNoteIcon')}${i.detail}</p>
          </div>`;
      });
      html += `</div></div></div>`;
    }

    // 警告
    if (results.warnings.length > 0) {
      html += `
      <div class="card decision-block warn-block">
        <div class="card-header"><h3><span class="dh-ico">${this.t('rIcoWarnings')}</span>${this.t('rTitleWarningsTxt')}</h3></div>
        <div class="card-body"><div class="decision-list warning-list">`;
      results.warnings.forEach(w => {
        const lvlCls = w.level === 'bad' ? 'warn-bad' : w.level === 'warning' ? 'warn-warn' : 'warn-info';
        html += `<div class="decision-warning ${lvlCls}"><span>${w.msg}</span></div>`;
      });
      html += `</div></div></div>`;
    }

    return html;
  },

  /** 双语字典 */
  LANG: {
    zh: {
      // 评估文本
      phTooAcid: '过酸', phTooAcidAdvice: '急需施用石灰(1-2吨/公顷)，分2次施用',
      phSlightlyAcid: '偏酸', phSlightlyAcidAdvice: '建议施用石灰(0.5-1吨/公顷)，配合有机肥',
      phOptimal: '适宜', phOptimalAdvice: 'pH处于最佳范围，保持现有管理',
      phSlightlyAlkaline: '偏碱', phSlightlyAlkalineAdvice: '施用硫磺或酸性有机肥调节，避免过量石灰',
      phTooAlkaline: '过碱', phTooAlkalineAdvice: '急需施用硫磺(200-400kg/公顷)调节pH',
      orgPoor: '贫瘠', orgPoorAdvice: '急需增施有机肥(10-15吨/公顷)，种植绿肥',
      orgLow: '偏低', orgLowAdvice: '增施腐熟有机肥(5-8吨/公顷)',
      orgGood: '良好', orgGoodAdvice: '有机质含量适宜，每年补充2-3吨/公顷',
      orgRich: '丰富', orgRichAdvice: '有机质充足，注意C/N比平衡',
      nutDeficient: '缺乏',
      nutDeficientAdvice: '建议施用{name}肥，推荐量{min}-{max}kg/公顷',
      nutLow: '偏低',
      nutLowAdvice: '适量补充{name}肥，推荐量{min}-{max}kg/公顷',
      nutSufficient: '充足',
      nutHigh: '偏高',
      nutHighAdvice: '{name}含量偏高，暂停施用{name}肥，适当灌溉稀释',
      tempTooLow: '过低', tempTooLowAdvice: '存在霜冻风险，需采取覆盖保温措施',
      tempLow: '偏低', tempLowAdvice: '温度偏低，生长缓慢，建议覆盖地膜保温',
      tempOptimal: '适宜', tempOptimalAdvice: '温度处于咖啡最佳生长范围',
      tempHigh: '偏高', tempHighAdvice: '需增加灌溉频率，必要时搭建遮阴网',
      tempTooHigh: '过高', tempTooHighAdvice: '高温危害，必须搭建遮阴设施，增加灌溉',
      rainExtremeDrought: '极旱', rainExtremeDroughtAdvice: '必须立即灌溉，每周至少50mm水量',
      rainDrought: '偏旱', rainDroughtAdvice: '需补充灌溉，建议滴灌每周30-40mm',
      rainOptimal: '适宜', rainOptimalAdvice: '降雨量适中，注意排水防涝',
      rainExcess: '偏多', rainExcessAdvice: '加强排水，注意真菌病害预防',
      rainTooMuch: '过多', rainTooMuchAdvice: '洪涝风险，紧急疏通排水系统，预防根腐病',
      moistDrought: '干旱', moistLow: '偏低', moistOptimal: '适宜', moistHigh: '偏高', moistWet: '过湿',
      sunInsufficient: '不足', sunInsufficientAdvice: '日照不足影响光合作用，注意遮阴树修剪',
      sunOptimal: '适宜', sunOptimalAdvice: '日照时长适中',
      sunStrong: '过强', sunStrongAdvice: '强日照可能导致叶片灼伤，建议遮阴',
      humLow: '偏低', humOptimal: '适宜', humHigh: '偏高', humHighAdvice: '高湿度易引发真菌病害，注意通风和防治',
      altLow: '偏低', altLowAdvice: '海拔偏低，品质可能受影响，建议遮阴降温',
      altBest: '最佳', altBestAdvice: '海拔高度适宜精品咖啡种植',
      altHigh: '高海拔', altHighAdvice: '高海拔有利风味发展，但注意霜冻防护',
      nName: '氮(N)', pName: '磷(P)', kName: '钾(K)',
      // 施肥
      fertSoilImprove: '土壤改良',
      fertLimeCaCO3: '农用石灰(CaCO₃)', fertLimeOrganic: '石灰+有机肥',
      fertLimeAmountHigh: '1.5-2吨/公顷', fertLimeAmountLow: '0.5-1吨/公顷',
      fertLimeTiming: '雨季来临前4-6周施用',
      reasonPh: '土壤pH{ph}，{text}',
      fertNitrogen: '氮肥',
      fertAmmoniumSulfate: '硫酸铵(21%N)', fertUrea: '尿素(46%N)',
      fertNAmountBad: '150-250kg/公顷硫酸铵', fertNAmountGood: '80-150kg/公顷硫酸铵',
      fertNTiming: '雨季开始时施用，分2次',
      reasonN: '土壤氮含量{n}mg/kg，{text}',
      fertPhosphorus: '磷肥',
      fertSuperphosphate: '过磷酸钙(16-20%P₂O₅)',
      fertPAmountBad: '200-400kg/公顷', fertPAmountGood: '100-200kg/公顷',
      fertPTiming: '种植穴施或雨季前条施',
      reasonP: '土壤磷含量{p}mg/kg，{text}',
      fertPotassium: '钾肥',
      fertPotassiumSulfate: '硫酸钾(50%K₂O)',
      fertKAmountBad: '200-350kg/公顷', fertKAmountGood: '100-200kg/公顷',
      fertKTiming: '雨季开始时与氮肥配合施用',
      reasonK: '土壤钾含量{k}mg/kg，{text}',
      fertOrganic: '有机肥',
      fertOrganicProduct: '腐熟牛粪/堆肥/咖啡果皮堆肥',
      fertOrgAmountBad: '10-15吨/公顷', fertOrgAmountGood: '5-8吨/公顷',
      fertOrgTiming: '雨季前翻入土壤，或作为覆盖物',
      reasonOrg: '有机质含量{org}%，{text}',
      fertOrganicMaintain: '有机肥(维持)',
      fertOrgMaintProduct: '腐熟有机堆肥',
      fertOrgMaintAmount: '2-3吨/公顷/年',
      fertOrgMaintTiming: '每年雨季前补充',
      reasonOrgMaint: '维持土壤有机质水平',
      // 修剪
      pruneYoung: '幼树定型修剪',
      pruneYoungTiming: '现在即可进行',
      pruneYoungSeason: '全年适宜（幼树）',
      pruneYoungMethod: '单干定型：保留主茎，摘除基部30cm内分枝，培养3-4层结果枝',
      pruneYoungDetail: '幼树期重点在于树形培养。去除徒长枝和交叉枝，保留健康的主枝。',
      pruneProductive: '盛产期修剪',
      pruneProductiveTiming: '本月为最佳修剪期',
      pruneProductiveSeason: '主修剪季(1-3月)',
      pruneProductiveMethod: '轻度修剪：去除病弱枝、交叉枝、过密枝。保持树冠通风透光。保留2-3个主干。',
      pruneProductiveDetail: '正处于肯尼亚咖啡主要修剪季节。剪去已结果的旧枝，保留1年生新枝作为来年结果枝。',
      pruneSecondary: '次要修剪',
      pruneSecondaryTiming: '本月适宜修剪',
      pruneSecondarySeason: '次修剪季(6-8月)',
      pruneSecondaryMethod: '轻度疏剪：摘除病叶、枯枝，适当疏除过多新梢',
      pruneSecondaryDetail: '次要修剪季节，以维护性修剪为主。',
      prunePlanned: '计划修剪',
      prunePlannedTiming: '建议在{window}进行',
      prunePlannedSeason: '下一个修剪窗口：{season}',
      prunePlannedMethod: '非修剪季节，仅做应急修剪（移除病枝、折断枝）',
      prunePlannedDetail: '当前不在最佳修剪窗口期。除非发现严重病害枝，否则建议等待下一个修剪季节。',
      pruneOldRenew: '老树更新修剪',
      pruneOldRenewTiming: '本月为最佳修剪期',
      pruneOldRenewSeason: '主修剪季(1-3月)',
      pruneOldRenewMethod: '更新复壮：选择1-2个健壮萌蘖枝培育为新主干，逐步替换老化主干。重剪后加强水肥管理。',
      pruneOldRenewDetail: '树龄{age}年，建议进行更新修剪。肯尼亚多采用多干更新法，每5-7年轮换主干。',
      pruneOldMaintain: '老树维护修剪',
      pruneOldMaintainTiming: '本月可进行维护修剪',
      pruneOldMaintainSeason: '次修剪季(6-8月)',
      pruneOldMaintainMethod: '去除老化枝、病弱枝，为下一季更新修剪做准备',
      pruneOldMaintainDetail: '树龄{age}年，密切关注产量下降趋势。',
      pruneOldPlanned: '计划更新修剪',
      pruneOldPlannedTiming: '建议在明年1-3月进行',
      pruneOldPlannedSeason: '等待主要修剪季(1-3月)',
      pruneOldPlannedMethod: '非修剪季，做好修剪计划准备',
      pruneOldPlannedDetail: '树龄{age}年高龄树，建议下次主修剪季进行更新复壮修剪。',
      windowSecondary: '6-8月', windowMain: '明年1-3月',
      nextWindowSecondary: '次要修剪季(6-8月)', nextWindowMain: '主要修剪季(1-3月)',
      // 灌溉
      irrImmediate: '立即', irrDripSprinkler: '滴灌/喷灌',
      irrAmt1: '50-70mm/周', irrFreq1: '每周2-3次',
      irrDetail1: '严重干旱，必须立即启动灌溉系统。避免中午高温时段灌溉。',
      irrSoon: '近期', irrDrip: '滴灌',
      irrAmt2: '25-40mm/周', irrFreq2: '每周1-2次',
      irrDetail2: '降雨不足，建议补充灌溉。保持土壤含水量在田间持水量的60-70%。',
      irrCaution: '注意', irrDrainage: '排水管理',
      irrNone: '无需灌溉', irrFreqDrain: '加强排水',
      irrDetail3: '降雨偏多，暂停灌溉，检查排水沟是否通畅。注意预防根部病害。',
      irrNormal: '正常', irrNaturalRain: '自然降雨为主',
      irrMonitor: '根据土壤湿度监测', irrAsNeeded: '按需补充',
      irrDetail4: '当前降雨量适宜，无需额外灌溉。建议安装土壤湿度监测设备。',
      // 警告
      warnTempBad: '⚠️ 温度{text}({temp}°C)，{advice}',
      warnHumidityHigh: '⚠️ 湿度偏高({hum}%)，注意真菌病害预防。建议喷施保护性杀菌剂。',
      warnSoilWet: '⚠️ 土壤过湿({moist}%)，存在根腐病风险，加强排水。',
      warnLowAltitude: 'ℹ️ 海拔{alt}m偏低，咖啡品质可能受影响。建议种植遮阴树降温，延长成熟期。',
      warnDiseaseRisk: '⚠️ 温湿度条件有利于咖啡叶锈病(Coffee Leaf Rust)和咖啡浆果病(CBD)发生，建议预防性喷药。',
      // 渲染
      rTitleOverview: '📊 数据评估总览',
      rTitleFertilizer: '🌱 施肥方案',
      rTitlePruning: '✂️ 修剪方案',
      rTitleIrrigation: '💧 灌溉/水分管理',
      rTitleWarnings: '⚠️ 风险预警',
      rIcoOverview: '📊', rTitleOverviewTxt: '数据评估总览',
      rIcoFertilizer: '🌱', rTitleFertilizerTxt: '施肥方案',
      rIcoPruning: '✂️', rTitlePruningTxt: '修剪方案',
      rIcoIrrigation: '💧', rTitleIrrigationTxt: '灌溉/水分管理',
      rIcoWarnings: '⚠️', rTitleWarningsTxt: '风险预警',
      rIrrMethod: '灌溉方式', rIrrAmount: '单次水量', rIrrFreq: '频率',
      rThMetric: '指标', rThValue: '当前值', rThStatus: '状态', rThAdvice: '建议',
      rThType: '类型', rThProduct: '推荐肥料', rThAmount: '用量', rThTiming: '施用时间', rThPriority: '优先级', rThReason: '原因',
      rLabelPH: '🌱 土壤pH', rLabelOrganic: '🪴 有机质',
      rLabelN: '🔬 氮(N)', rLabelP: '🔬 磷(P)', rLabelK: '🔬 钾(K)',
      rLabelMoisture: '💧 土壤湿度', rLabelTemp: '🌡️ 平均温度',
      rLabelRain: '🌧️ 月降雨量', rLabelSun: '☀️ 日照时长',
      rLabelHumidity: '💨 相对湿度', rLabelAltitude: '⛰️ 海拔高度',
      pHigh: '高', pMedium: '中', pLow: '低',
      rPrioritySuffix: '优先级',
      rPruneTime: '⏰ 修剪时间：', rSeason: '📅 季节：',
      rMethodIcon: '🔧 ', rNoteIcon: '📝 ', rSep: ' | '
    },
    en: {
      // 评估文本
      phTooAcid: 'Too acidic', phTooAcidAdvice: 'Urgently apply lime (1-2 t/ha) in 2 applications',
      phSlightlyAcid: 'Slightly acidic', phSlightlyAcidAdvice: 'Apply lime (0.5-1 t/ha) with organic fertilizer',
      phOptimal: 'Optimal', phOptimalAdvice: 'pH in optimal range, maintain current management',
      phSlightlyAlkaline: 'Slightly alkaline', phSlightlyAlkalineAdvice: 'Apply sulfur or acidic organic fertilizer; avoid excess lime',
      phTooAlkaline: 'Too alkaline', phTooAlkalineAdvice: 'Urgently apply sulfur (200-400 kg/ha) to adjust pH',
      orgPoor: 'Poor', orgPoorAdvice: 'Urgently add organic fertilizer (10-15 t/ha), plant green manure',
      orgLow: 'Low', orgLowAdvice: 'Add composted organic fertilizer (5-8 t/ha)',
      orgGood: 'Good', orgGoodAdvice: 'Organic matter is adequate; replenish 2-3 t/ha annually',
      orgRich: 'Rich', orgRichAdvice: 'Rich organic matter; watch C/N ratio balance',
      nutDeficient: 'Deficient',
      nutDeficientAdvice: 'Apply {name} fertilizer, recommended {min}-{max} kg/ha',
      nutLow: 'Low',
      nutLowAdvice: 'Supplement {name} fertilizer, recommended {min}-{max} kg/ha',
      nutSufficient: 'Adequate',
      nutHigh: 'High',
      nutHighAdvice: '{name} level is high, pause {name} fertilizer and irrigate to dilute',
      tempTooLow: 'Too low', tempTooLowAdvice: 'Frost risk; use cover/insulation measures',
      tempLow: 'Low', tempLowAdvice: 'Low temperature slows growth; use mulch to retain heat',
      tempOptimal: 'Optimal', tempOptimalAdvice: 'Temperature in optimal coffee growing range',
      tempHigh: 'High', tempHighAdvice: 'Increase irrigation frequency; set up shade netting if needed',
      tempTooHigh: 'Too high', tempTooHighAdvice: 'Heat stress; set up shade and increase irrigation',
      rainExtremeDrought: 'Extreme drought', rainExtremeDroughtAdvice: 'Irrigate immediately, at least 50mm per week',
      rainDrought: 'Dry', rainDroughtAdvice: 'Supplement irrigation; drip 30-40mm weekly',
      rainOptimal: 'Optimal', rainOptimalAdvice: 'Rainfall adequate; ensure drainage',
      rainExcess: 'High', rainExcessAdvice: 'Improve drainage; watch for fungal disease',
      rainTooMuch: 'Excessive', rainTooMuchAdvice: 'Flooding risk; clear drainage urgently, prevent root rot',
      moistDrought: 'Drought', moistLow: 'Low', moistOptimal: 'Optimal', moistHigh: 'High', moistWet: 'Waterlogged',
      sunInsufficient: 'Insufficient', sunInsufficientAdvice: 'Insufficient sunlight affects photosynthesis; prune shade trees',
      sunOptimal: 'Optimal', sunOptimalAdvice: 'Sunlight duration is adequate',
      sunStrong: 'Too strong', sunStrongAdvice: 'Strong sunlight may scorch leaves; provide shade',
      humLow: 'Low', humOptimal: 'Optimal', humHigh: 'High', humHighAdvice: 'High humidity may cause fungal disease; ensure ventilation and control',
      altLow: 'Low', altLowAdvice: 'Low altitude may affect quality; provide shade to cool',
      altBest: 'Best', altBestAdvice: 'Altitude ideal for specialty coffee',
      altHigh: 'High altitude', altHighAdvice: 'High altitude favors flavor; watch frost protection',
      nName: 'Nitrogen (N)', pName: 'Phosphorus (P)', kName: 'Potassium (K)',
      // 施肥
      fertSoilImprove: 'Soil improvement',
      fertLimeCaCO3: 'Agricultural lime (CaCO₃)', fertLimeOrganic: 'Lime + organic fertilizer',
      fertLimeAmountHigh: '1.5-2 t/ha', fertLimeAmountLow: '0.5-1 t/ha',
      fertLimeTiming: 'Apply 4-6 weeks before rainy season',
      reasonPh: 'Soil pH {ph}, {text}',
      fertNitrogen: 'Nitrogen fertilizer',
      fertAmmoniumSulfate: 'Ammonium sulfate (21%N)', fertUrea: 'Urea (46%N)',
      fertNAmountBad: '150-250 kg/ha ammonium sulfate', fertNAmountGood: '80-150 kg/ha ammonium sulfate',
      fertNTiming: 'Apply at start of rainy season, in 2 split doses',
      reasonN: 'Soil nitrogen {n} mg/kg, {text}',
      fertPhosphorus: 'Phosphorus fertilizer',
      fertSuperphosphate: 'Superphosphate (16-20% P₂O₅)',
      fertPAmountBad: '200-400 kg/ha', fertPAmountGood: '100-200 kg/ha',
      fertPTiming: 'Apply in planting hole or band before rainy season',
      reasonP: 'Soil phosphorus {p} mg/kg, {text}',
      fertPotassium: 'Potassium fertilizer',
      fertPotassiumSulfate: 'Potassium sulfate (50% K₂O)',
      fertKAmountBad: '200-350 kg/ha', fertKAmountGood: '100-200 kg/ha',
      fertKTiming: 'Apply with nitrogen at start of rainy season',
      reasonK: 'Soil potassium {k} mg/kg, {text}',
      fertOrganic: 'Organic fertilizer',
      fertOrganicProduct: 'Composted manure / compost / coffee pulp compost',
      fertOrgAmountBad: '10-15 t/ha', fertOrgAmountGood: '5-8 t/ha',
      fertOrgTiming: 'Work into soil before rains or use as mulch',
      reasonOrg: 'Organic matter {org}%, {text}',
      fertOrganicMaintain: 'Organic fertilizer (maintenance)',
      fertOrgMaintProduct: 'Composted organic manure',
      fertOrgMaintAmount: '2-3 t/ha/year',
      fertOrgMaintTiming: 'Replenish before rainy season each year',
      reasonOrgMaint: 'Maintain soil organic matter level',
      // 修剪
      pruneYoung: 'Young tree training',
      pruneYoungTiming: 'Can be done now',
      pruneYoungSeason: 'Suitable all year (young trees)',
      pruneYoungMethod: 'Single-stem training: keep main stem, remove branches within 30cm of base, develop 3-4 fruiting tiers',
      pruneYoungDetail: 'Focus on shaping young trees. Remove vigorous and crossing branches, keep healthy main branches.',
      pruneProductive: 'Full-production pruning',
      pruneProductiveTiming: 'This month is the optimal pruning window',
      pruneProductiveSeason: 'Main pruning season (Jan-Mar)',
      pruneProductiveMethod: 'Light pruning: remove diseased, weak, crossing and dense branches. Keep canopy ventilated. Retain 2-3 main stems.',
      pruneProductiveDetail: 'Main pruning season for Kenyan coffee. Cut old fruited branches, keep 1-year shoots as next year fruiting wood.',
      pruneSecondary: 'Secondary pruning',
      pruneSecondaryTiming: 'Suitable for pruning this month',
      pruneSecondarySeason: 'Secondary pruning season (Jun-Aug)',
      pruneSecondaryMethod: 'Light thinning: remove diseased leaves, dead branches, thin excess shoots',
      pruneSecondaryDetail: 'Secondary pruning season; mainly maintenance pruning.',
      prunePlanned: 'Planned pruning',
      prunePlannedTiming: 'Recommended in {window}',
      prunePlannedSeason: 'Next pruning window: {season}',
      prunePlannedMethod: 'Not pruning season; emergency pruning only (remove diseased/broken branches)',
      prunePlannedDetail: 'Not in the optimal pruning window. Unless serious disease is found, wait for the next pruning season.',
      pruneOldRenew: 'Old tree renewal pruning',
      pruneOldRenewTiming: 'This month is the optimal pruning window',
      pruneOldRenewSeason: 'Main pruning season (Jan-Mar)',
      pruneOldRenewMethod: 'Rejuvenation: select 1-2 vigorous suckers as new stems, gradually replace aged stems. Strengthen water/fertilizer after heavy pruning.',
      pruneOldRenewDetail: 'Tree age {age} years; recommend renewal pruning. Kenya commonly uses multiple-stem renewal, rotating stems every 5-7 years.',
      pruneOldMaintain: 'Old tree maintenance pruning',
      pruneOldMaintainTiming: 'Maintenance pruning can be done this month',
      pruneOldMaintainSeason: 'Secondary pruning season (Jun-Aug)',
      pruneOldMaintainMethod: 'Remove aged and diseased/weak branches to prepare for next renewal pruning',
      pruneOldMaintainDetail: 'Tree age {age} years; closely monitor yield decline.',
      pruneOldPlanned: 'Planned renewal pruning',
      pruneOldPlannedTiming: 'Recommended next Jan-Mar',
      pruneOldPlannedSeason: 'Awaiting main pruning season (Jan-Mar)',
      pruneOldPlannedMethod: 'Not pruning season; prepare pruning plan',
      pruneOldPlannedDetail: 'Old tree aged {age} years; recommend renewal pruning next main season.',
      windowSecondary: 'Jun-Aug', windowMain: 'next Jan-Mar',
      nextWindowSecondary: 'Secondary pruning season (Jun-Aug)', nextWindowMain: 'Main pruning season (Jan-Mar)',
      // 灌溉
      irrImmediate: 'Immediate', irrDripSprinkler: 'Drip/sprinkler',
      irrAmt1: '50-70mm/week', irrFreq1: '2-3 times/week',
      irrDetail1: 'Severe drought; start irrigation immediately. Avoid irrigating during midday heat.',
      irrSoon: 'Soon', irrDrip: 'Drip irrigation',
      irrAmt2: '25-40mm/week', irrFreq2: '1-2 times/week',
      irrDetail2: 'Insufficient rain; supplement irrigation. Keep soil moisture at 60-70% of field capacity.',
      irrCaution: 'Caution', irrDrainage: 'Drainage management',
      irrNone: 'No irrigation needed', irrFreqDrain: 'Strengthen drainage',
      irrDetail3: 'Excess rain; pause irrigation, check drainage ditches. Prevent root diseases.',
      irrNormal: 'Normal', irrNaturalRain: 'Natural rainfall',
      irrMonitor: 'Based on soil moisture monitoring', irrAsNeeded: 'Supplement as needed',
      irrDetail4: 'Rainfall adequate; no extra irrigation. Consider installing soil moisture sensors.',
      // 警告
      warnTempBad: '⚠️ Temperature {text} ({temp}°C), {advice}',
      warnHumidityHigh: '⚠️ High humidity ({hum}%), watch for fungal disease. Apply protective fungicide.',
      warnSoilWet: '⚠️ Waterlogged soil ({moist}%), root rot risk; improve drainage.',
      warnLowAltitude: 'ℹ️ Altitude {alt}m is low; coffee quality may suffer. Plant shade trees to cool and extend maturation.',
      warnDiseaseRisk: '⚠️ Temperature/humidity favor Coffee Leaf Rust and Coffee Berry Disease (CBD); apply preventive spraying.',
      // 渲染
      rTitleOverview: '📊 Evaluation Overview',
      rTitleFertilizer: '🌱 Fertilizer Plan',
      rTitlePruning: '✂️ Pruning Plan',
      rTitleIrrigation: '💧 Irrigation / Water Management',
      rTitleWarnings: '⚠️ Risk Alerts',
      rIcoOverview: '📊', rTitleOverviewTxt: 'Evaluation Overview',
      rIcoFertilizer: '🌱', rTitleFertilizerTxt: 'Fertilizer Plan',
      rIcoPruning: '✂️', rTitlePruningTxt: 'Pruning Plan',
      rIcoIrrigation: '💧', rTitleIrrigationTxt: 'Irrigation / Water Management',
      rIcoWarnings: '⚠️', rTitleWarningsTxt: 'Risk Alerts',
      rIrrMethod: 'Method', rIrrAmount: 'Amount', rIrrFreq: 'Frequency',
      rThMetric: 'Metric', rThValue: 'Current Value', rThStatus: 'Status', rThAdvice: 'Advice',
      rThType: 'Type', rThProduct: 'Recommended Fertilizer', rThAmount: 'Dosage', rThTiming: 'Timing', rThPriority: 'Priority', rThReason: 'Reason',
      rLabelPH: '🌱 Soil pH', rLabelOrganic: '🪴 Organic Matter',
      rLabelN: '🔬 Nitrogen (N)', rLabelP: '🔬 Phosphorus (P)', rLabelK: '🔬 Potassium (K)',
      rLabelMoisture: '💧 Soil Moisture', rLabelTemp: '🌡️ Avg Temperature',
      rLabelRain: '🌧️ Monthly Rainfall', rLabelSun: '☀️ Sunlight',
      rLabelHumidity: '💨 Relative Humidity', rLabelAltitude: '⛰️ Altitude',
      pHigh: 'High', pMedium: 'Medium', pLow: 'Low',
      rPrioritySuffix: ' priority',
      rPruneTime: '⏰ Pruning time: ', rSeason: '📅 Season: ',
      rMethodIcon: '🔧 ', rNoteIcon: '📝 ', rSep: ' | '
    }
  }
};
