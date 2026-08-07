// api/request-demo.js
//
// Receives the demo request form and emails it.
// Always returns JSON, so the page can show a real reason when something fails.

export default async function handler(req, res) {
  // ---- always answer with JSON ----
  res.setHeader('Content-Type', 'application/json');

  // ---- which sites may use this form ----
  // Every address the site is reachable at, plus Vercel preview deploys.
  // Add any new domain here or the browser will be refused.
  const ALLOWED = [
    'https://arciom.com',
    'https://www.arciom.com',
    'https://arciom-marketing-website.vercel.app'
  ];
  const origin = req.headers.origin || '';
  const ok = ALLOWED.includes(origin) || /^https:\/\/arciom-marketing-website-.*\.vercel\.app$/.test(origin);

  res.setHeader('Access-Control-Allow-Origin', ok ? origin : ALLOWED[0]);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // requests with no Origin header (curl, server-to-server) are allowed through;
  // only reject a browser that names an origin we do not recognise
  if (origin && !ok) {
    return res.status(403).json({
      error: 'Origin not allowed: ' + origin + '. Add it to the ALLOWED list in api/request-demo.js.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // ---- read the body, whether Vercel parsed it or not ----
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      return res.status(400).json({ error: 'Body was not valid JSON.' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'No form data received.' });
  }

  const name    = (body.name    || '').toString().trim();
  const email   = (body.email   || '').toString().trim();
  const company = (body.company || '').toString().trim();
  const phone   = (body.phone   || '').toString().trim();
  const message = (body.message || '').toString().trim();

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  // ---- check configuration before trying to send ----
  const KEY = process.env.RESEND_API_KEY;
  if (!KEY) {
    return res.status(500).json({
      error: 'RESEND_API_KEY is not set in Vercel environment variables. Add it, then redeploy.'
    });
  }

  const FROM = process.env.MAIL_FROM || 'onboarding@resend.dev';
  const TO   = process.env.MAIL_TO   || 'Ryan@arciom.com';

  const text =
    'New demo request from arciom.com\n\n' +
    'Name:    ' + name + '\n' +
    'Email:   ' + email + '\n' +
    'Company: ' + (company || '—') + '\n' +
    (phone && phone !== 'Not provided' ? 'Phone:   ' + phone + '\n' : '') +
    '\n' + message;

  try {
    const send = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: 'Demo request — ' + name + (company ? ' (' + company + ')' : ''),
        text: text
      })
    });

    const raw = await send.text();

    if (!send.ok) {
      // pass Resend's own reason back so it shows on the page
      let detail = raw;
      try { detail = JSON.parse(raw).message || raw; } catch (e) {}
      console.error('Resend rejected the send:', send.status, raw);
      return res.status(500).json({ error: 'Email service error: ' + detail });
    }

    console.log('Demo request sent for', email);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Unexpected failure:', err);
    return res.status(500).json({ error: 'Server error: ' + (err.message || 'unknown') });
  }
}
