/* ============================================
   肯尼亚咖啡豆种植系统 - 找回密码验证码服务
   Netlify Function：生成验证码 -> 真实发送邮件 -> 服务端校验

   邮件渠道（二选一，在 Netlify 环境变量中配置）：

   A. Resend（海外服务，注册即送免费额度）：
      RESEND_API_KEY  : Resend 的 API Key
      MAIL_FROM       : 发件人，如 "Kenya Coffee <no-reply@your-domain.com>"
                        未配置时默认 onboarding@resend.dev（仅能发给注册邮箱）

   B. SMTP（国内常用 QQ/163 邮箱授权码，无需第三方账号）：
      SMTP_HOST       : 如 smtp.qq.com / smtp.163.com
      SMTP_PORT       : 可选，默认 465（SSL 直连）；若用 587 需设 SMTP_SECURE=false
      SMTP_SECURE     : 可选，默认 true
      SMTP_USER       : 邮箱账号
      SMTP_PASS       : 授权码（QQ/163 在邮箱设置中开启 SMTP 获取，不是登录密码）
      MAIL_FROM       : 发件人，如 "Kenya Coffee <xxx@qq.com>"

   请求体（POST JSON）：
     { action: 'send',   email, lang }  生成验证码并发送邮件
     { action: 'verify', email, code }  校验验证码
   响应体：{ ok: true } 或 { ok: false, error: '错误码' }
   ============================================ */

const net = require('net');
const tls = require('tls');
const crypto = require('crypto');

const CODE_TTL_MS = 10 * 60 * 1000;   // 验证码有效期 10 分钟
const RESEND_GAP_MS = 60 * 1000;      // 同一邮箱 60 秒内不可重复发送
const MAX_ATTEMPTS = 5;               // 最多错误尝试次数，超过后作废

// 进程内验证码存储（email -> { code, expiresAt, lastSentAt, attempts }）
const store = new Map();

/* ========== CORS（与 ai-chat.js 保持一致，放行所有来源） ========== */
function corsHeaders(event) {
  const origin = (event.headers && event.headers.origin) || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

/* ========== 邮件内容模板（中英双语） ========== */
function buildMailContent(lang, code) {
  if (lang === 'en') {
    return {
      subject: '[Kenya Coffee] Password Reset Code ' + code,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
<h2 style="color:#1f8a4c;margin:0 0 12px">Kenya Coffee Cultivation System</h2>
<p style="color:#374151;line-height:1.6">Your password reset verification code is:</p>
<div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#1f8a4c;background:#f0fdf4;border-radius:8px;padding:12px;text-align:center;margin:16px 0">${code}</div>
<p style="color:#6b7280;font-size:13px;line-height:1.6">The code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
</div>`
    };
  }
  return {
    subject: '【肯尼亚咖啡】密码重置验证码 ' + code,
    html: `<div style="font-family:'Microsoft YaHei',sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
<h2 style="color:#1f8a4c;margin:0 0 12px">肯尼亚咖啡豆种植系统</h2>
<p style="color:#374151;line-height:1.6">您的密码重置验证码为：</p>
<div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#1f8a4c;background:#f0fdf4;border-radius:8px;padding:12px;text-align:center;margin:16px 0">${code}</div>
<p style="color:#6b7280;font-size:13px;line-height:1.6">验证码 10 分钟内有效。如非本人操作，请忽略此邮件。</p>
</div>`
  };
}

/* ========== 渠道 A：Resend HTTP API ========== */
async function sendViaResend(apiKey, to, subject, html) {
  const from = process.env.MAIL_FROM || 'Kenya Coffee <onboarding@resend.dev>';
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to: [to], subject, html })
  });
  if (!resp.ok) {
    let detail = '';
    try { detail = (await resp.text()).slice(0, 300); } catch (_) {}
    throw { code: 'SEND_FAIL', detail: 'Resend HTTP ' + resp.status + ' ' + detail };
  }
}

/* ========== 渠道 B：极简 SMTP 客户端（无第三方依赖） ==========
   支持 465 直接 TLS 与 587 STARTTLS 升级 */
function smtpSend({ host, port, secure, user, pass, from, to, subject, html }) {
  return new Promise((resolve, reject) => {
    const fromAddr = (from.match(/<([^>]+)>/) || [null, from])[1].trim();

    let socket = secure
      ? tls.connect({ host, port, rejectUnauthorized: false })
      : net.connect(port, host);
    let buffer = '';
    let settled = false;

    const fail = (msg) => {
      if (settled) return;
      settled = true;
      try { socket.destroy(); } catch (_) {}
      reject(new Error(msg));
    };

    socket.on('error', (e) => fail('connection error: ' + e.message));

    const waitResponse = () => new Promise((res, rej) => {
      const timer = setTimeout(() => rej(new Error('SMTP timeout')), 25000);
      const onData = (chunk) => {
        buffer += chunk.toString('utf8');
        let i;
        while ((i = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, i).replace(/\r$/, '');
          buffer = buffer.slice(i + 1);
          if (/^\d{3}-/.test(line)) continue; // 多行响应续行
          const m = /^(\d{3})/.exec(line);
          if (m) {
            clearTimeout(timer);
            socket.removeListener('data', onData);
            res({ code: m[1], line });
            return;
          }
        }
      };
      socket.on('data', onData);
    });

    const cmd = async (c, expected) => {
      socket.write(c + '\r\n');
      const r = await waitResponse();
      if (r.code !== expected) throw new Error('SMTP expected ' + expected + ', got ' + r.code + ' ' + r.line);
      return r;
    };

    const ehlo = () => cmd('EHLO ' + (process.env.SMTP_EHLO || 'mail.localhost'), '250');

    (async () => {
      await waitResponse(); // 等待 220 问候
      await ehlo();

      if (!secure) {
        // 587：STARTTLS 升级
        await cmd('STARTTLS', '220');
        await new Promise((res, rej) => {
          const upgraded = tls.connect({ socket, rejectUnauthorized: false }, res);
          upgraded.on('error', rej);
          socket.removeAllListeners('data');
          socket = upgraded;
        });
        await ehlo();
      }

      await cmd('AUTH LOGIN', '334');
      await cmd(Buffer.from(user).toString('base64'), '334');
      await cmd(Buffer.from(pass).toString('base64'), '235');

      const base64Body = Buffer.from(html, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n');
      const message = [
        'From: ' + from,
        'To: ' + to,
        'Subject: =?UTF-8?B?' + Buffer.from(subject, 'utf8').toString('base64') + '?=',
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        base64Body
      ].join('\r\n');

      await cmd('MAIL FROM:<' + fromAddr + '>', '250');
      await cmd('RCPT TO:<' + to + '>', '250');
      await cmd('DATA', '354');
      socket.write(message + '\r\n.\r\n');
      const r = await waitResponse();
      if (r.code !== '250') throw new Error('SMTP DATA got ' + r.code + ' ' + r.line);
      await cmd('QUIT', '221');
      try { socket.destroy(); } catch (_) {}
      settled = true;
      resolve();
    })().catch((e) => fail(e && e.message ? e.message : String(e)));
  });
}

async function sendViaSmtp(to, subject, html) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = (process.env.SMTP_SECURE || 'true') !== 'false';
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.MAIL_FROM || user;
  if (!user || !pass) {
    throw { code: 'NO_MAIL_CONFIG', detail: 'SMTP_USER/SMTP_PASS missing' };
  }
  await smtpSend({ host, port, secure, user, pass, from, to, subject, html });
}

/* ========== 发送邮件（自动选择渠道） ========== */
async function sendVerificationMail({ to, subject, html }) {
  const resendKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  if (resendKey) return sendViaResend(resendKey, to, subject, html);
  if (smtpHost) return sendViaSmtp(to, subject, html);
  throw { code: 'NO_MAIL_CONFIG', detail: 'no mail channel configured' };
}

/* ========== action: send ========== */
async function handleSend(body, headers) {
  const email = String(body.email || '').trim().toLowerCase();
  const lang = body.lang === 'en' ? 'en' : 'zh';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'EMAIL_INVALID' }) };
  }

  const now = Date.now();
  const rec = store.get(email);
  if (rec && now - rec.lastSentAt < RESEND_GAP_MS) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'TOO_FREQUENT' }) };
  }

  const code = String(crypto.randomInt(100000, 1000000));
  const mail = buildMailContent(lang, code);

  try {
    await sendVerificationMail({ to: email, subject: mail.subject, html: mail.html });
  } catch (e) {
    console.error('[forgot-code] send failed:', e.detail || e.message || e);
    if (e.code === 'NO_MAIL_CONFIG') {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'NO_MAIL_CONFIG' }) };
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: false, error: 'SEND_FAIL', detail: String(e.detail || e.message || '').slice(0, 200) })
    };
  }

  store.set(email, { code, expiresAt: now + CODE_TTL_MS, lastSentAt: now, attempts: 0 });
  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
}

/* ========== action: verify ========== */
function handleVerify(body, headers) {
  const email = String(body.email || '').trim().toLowerCase();
  const code = String(body.code || '').trim();

  const rec = store.get(email);
  if (!rec || Date.now() > rec.expiresAt) {
    store.delete(email);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'CODE_EXPIRED' }) };
  }
  if (rec.attempts >= MAX_ATTEMPTS) {
    store.delete(email);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'CODE_EXPIRED' }) };
  }
  if (rec.code !== code) {
    rec.attempts += 1;
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'CODE_WRONG' }) };
  }

  store.delete(email);
  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
}

exports.handler = async (event) => {
  const headers = corsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'METHOD' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'BAD_JSON' }) };
  }

  if (body.action === 'send') return handleSend(body, headers);
  if (body.action === 'verify') return handleVerify(body, headers);
  return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'BAD_ACTION' }) };
};
