/* ============================================
   肯尼亚咖啡豆种植系统 - AI 问答代理
   Netlify Function：把聊天请求转发到大模型 API
   （默认火山方舟/豆包，OpenAI 兼容接口）

   环境变量（Netlify 后台配置）：
   - AI_API_KEY   : 必填，火山方舟 ARK_API_KEY 或任意 OpenAI 兼容 Key
   - AI_BASE_URL  : 可选，默认 https://ark.cn-beijing.volces.com/api/v3/chat/completions
   - AI_MODEL     : 可选，默认 doubao-1-5-pro-32k-250115
   - ARK_API_KEY  : 兼容变量，若未设置 AI_API_KEY 时使用

   请求体：{ messages: [{role, content}], lang: 'zh' | 'en' }
   响应体：{ answer: string }
   ============================================ */

const DEFAULT_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const DEFAULT_MODEL = 'doubao-1-5-pro-32k-250115';

// CORS 允许的来源：本地开发 + Netlify 站点
const ALLOW_ORIGINS = ['http://localhost:8123', 'http://localhost:8888', 'https://*.netlify.app', 'https://*.netlify.live'];

function getCorsOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return '*';
  if (ALLOW_ORIGINS.some(p => p.startsWith('https://*.') ? origin.startsWith(p.replace('*', '')) : p === origin)) {
    return origin;
  }
  return origin; // 放行所有来源（静态站部署地址可能变化）
}

function corsHeaders(req) {
  const origin = getCorsOrigin(req);
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

/** 构建系统提示词：让 AI 扮演肯尼亚咖啡种植专家 */
function buildSystemPrompt(lang, kbSummary) {
  if (lang === 'en') {
    return [
      'You are "Kenya Coffee Assistant", an expert on Kenyan coffee growing and the Kenya Coffee Growing System app.',
      'Your domain: cultivation management, pest & disease diagnosis, varieties & regions, processing & grading, roasting & brewing, business & market.',
      'Style requirements:',
      '- Respond naturally and conversationally, like a knowledgeable friend. Do NOT output long markdown tables.',
      '- Be concise: give a conclusion first, then 2-4 bullet points.',
      '- Proactively ask for key info (altitude, soil pH, rainfall, symptoms) when you need it to give targeted advice.',
      '- If genuinely unsure, say so honestly. Never invent facts.',
      '- Occasionally relate answers to the user\'s saved soil/weather data if relevant.',
      kbSummary ? ('Local knowledge base reference (use when relevant):\n' + kbSummary) : ''
    ].filter(Boolean).join('\n\n');
  }
  return [
    '你是"肯尼亚咖啡助手"，肯尼亚咖啡种植领域的专家，服务于"肯尼亚咖啡豆种植系统"应用。',
    '擅长领域：种植管理（土壤pH、施肥、灌溉、遮荫、修剪、育苗）、病虫害诊断（叶锈病、浆果病等）、品种与产区（SL28/SL34、六大产区）、处理与分级（双重水洗、AA/AB等级）、烘焙冲煮、经营与市场。',
    '风格要求：',
    '- 像朋友一样自然、口语化地对话，不要输出大段 markdown 表格。',
    '- 简洁：先给结论，再列 2-4 条要点。',
    '- 主动追问关键信息（海拔、土壤pH、降雨量、具体症状等），以便给出针对性建议。',
    '- 不确定时坦诚说明，绝不编造。',
    '- 适当结合用户已录入的土壤/气象数据给出个性化建议。',
    kbSummary ? ('本地知识库参考（相关时使用）：\n' + kbSummary) : ''
  ].filter(Boolean).join('\n\n');
}

exports.handler = async (event, context) => {
  // 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(event), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(event), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const headers = corsHeaders(event);

  // 解析请求
  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const lang = body.lang === 'en' ? 'en' : 'zh';
  const kbSummary = typeof body.kbSummary === 'string' ? body.kbSummary.slice(0, 6000) : '';
  if (!messages.length) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'messages is required' }) };
  }

  // 读取密钥（支持 AI_API_KEY 与 ARK_API_KEY）
  const apiKey = process.env.AI_API_KEY || process.env.ARK_API_KEY || '';
  if (!apiKey) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer: '', ai: false, reason: 'NO_KEY' })
    };
  }

  const baseUrl = process.env.AI_BASE_URL || DEFAULT_BASE_URL;
  const model = process.env.AI_MODEL || DEFAULT_MODEL;

  const payload = {
    model,
    messages: [
      { role: 'system', content: buildSystemPrompt(lang, kbSummary) },
      ...messages.slice(-10) // 最多保留最近 10 条，控制 token
    ],
    temperature: 0.7,
    max_tokens: 900,
    stream: false
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);

    const upstream = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!upstream.ok) {
      let detail = '';
      try {
        const errBody = await upstream.text();
        detail = errBody.slice(0, 300);
      } catch (_) {}
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ answer: '', ai: false, reason: 'UPSTREAM_ERROR', detail, code: upstream.status })
      };
    }

    const data = await upstream.json();
    const answer = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content.trim()
      : '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer, ai: true })
    };
  } catch (err) {
    console.error('[ai-chat] proxy error:', err.message || err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer: '', ai: false, reason: 'PROXY_ERROR', detail: (err.message || '').slice(0, 200) })
    };
  }
};
