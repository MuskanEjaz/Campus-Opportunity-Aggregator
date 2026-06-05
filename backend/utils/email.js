const nodemailer = require('nodemailer');
const dns = require('dns').promises;

function createTransporter() {
    return nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

const FROM = process.env.SMTP_FROM || `Campus Opportunity Aggregator <${process.env.SMTP_USER}>`;

/** Verifies that the email domain has valid MX records. */
async function validateEmailDomain(email) {
    const domain = email.split('@')[1];
    if (!domain) return false;
    try {
        const records = await dns.resolveMx(domain);
        return Array.isArray(records) && records.length > 0;
    } catch {
        return false;
    }
}

/** Sends a welcome / account-created confirmation email. */
async function sendWelcomeEmail(to, userName) {
    const transporter = createTransporter();
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f0eeff; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; }
  .wrapper  { max-width: 580px; margin: 40px auto; padding: 0 16px 48px; }
  .card     { background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 6px 32px rgba(109,40,217,0.10); border: 1px solid #ede9fe; }
  .header   { background: linear-gradient(135deg, #0f0e2b 0%, #1e1b4b 55%, #312e81 100%); padding: 40px 44px 32px; }
  .logo-row { display: flex; align-items: center; gap: 14px; margin-bottom: 4px; }
  .logo-box { width: 46px; height: 46px; background: linear-gradient(135deg, #7c3aed, #a78bfa); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .app-name { color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
  .tagline  { color: rgba(255,255,255,0.45); font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; margin-top: 3px; }
  .body     { padding: 40px 44px 32px; }
  .tick     { width: 58px; height: 58px; background: #f0fdf4; border: 2px solid #6ee7b7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 24px; }
  .heading  { font-size: 22px; font-weight: 800; color: #1a1035; text-align: center; margin-bottom: 8px; letter-spacing: -0.01em; }
  .subhead  { font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 30px; line-height: 1.6; }
  .info-box { background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px; padding: 18px 22px; margin-bottom: 28px; }
  .info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; border-bottom: 1px solid #ede9fe; }
  .info-row:last-child { border-bottom: none; }
  .info-label { color: #7c3aed; font-weight: 600; }
  .info-value { color: #1a1035; font-weight: 500; }
  .cta-wrap  { text-align: center; margin-bottom: 28px; }
  .cta       { display: inline-block; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: 700; font-size: 15px; letter-spacing: 0.01em; box-shadow: 0 4px 18px rgba(109,40,217,0.35); }
  .note      { font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.6; }
  .footer    { padding: 20px 44px 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">

    <div class="header">
      <div class="logo-row">
        <div class="logo-box">🎓</div>
        <div>
          <div class="app-name">Campus Opportunity Aggregator</div>
          <div class="tagline">NUST &nbsp;·&nbsp; Discover &nbsp;·&nbsp; Apply &nbsp;·&nbsp; Grow</div>
        </div>
      </div>
    </div>

    <div class="body">
      <div class="tick">✅</div>
      <h1 class="heading">Account Created Successfully!</h1>
      <p class="subhead">Welcome to Campus Opportunities, <strong>${userName}</strong>.<br/>Your account is active and ready to use.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Username</span>
          <span class="info-value">${userName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">${to}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-value" style="color:#059669;font-weight:700;">Active ✓</span>
        </div>
      </div>

      <div class="cta-wrap">
        <a href="${appUrl}/opportunities" class="cta">Explore Opportunities →</a>
      </div>

      <p class="note">
        You can now log in and start browsing 246+ internships, scholarships,<br/>
        hackathons, research positions, and more — all in one place.
      </p>
    </div>

    <div class="footer">
      <p>This confirmation was sent to <strong>${to}</strong>.</p>
      <p style="margin-top:6px;">© 2025 Campus Opportunity Aggregator &nbsp;·&nbsp; NUST</p>
    </div>

  </div>
</div>
</body>
</html>`;

    await transporter.sendMail({
        from:    FROM,
        to,
        subject: `✅ Account Created — Campus Opportunity Aggregator`,
        html,
    });
}

module.exports = { validateEmailDomain, sendWelcomeEmail };
