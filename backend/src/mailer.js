// src/mailer.js
const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST || "";
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER || "";
const pass = process.env.SMTP_PASS || "";
const from = process.env.FROM_EMAIL || "TaxPal <no-reply@taxpal.local>";

let transporter = null;
let transporterReady = false;

if (host && user) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, otherwise use STARTTLS
    auth: { user, pass },
    tls: { rejectUnauthorized: true },
    pool: true,
    // timeouts to avoid long hangs
    connectionTimeout: 10_000, // 10s to establish TCP
    greetingTimeout: 10_000,   // 10s to receive SMTP greeting
    socketTimeout: 20_000      // 20s overall socket timeout
  });

  transporter.verify()
    .then(() => {
      console.log("SMTP transporter verified.");
      transporterReady = true;
    })
    .catch(err => {
      console.warn("SMTP transporter verify failed:", err && err.message ? err.message : err);
      transporterReady = false;
    });
} else {
  console.warn("SMTP not fully configured (SMTP_HOST or SMTP_USER missing). Emails will not be sent.");
}

/**
 * sendMail - sends mail, returns { info, previewUrl } on success.
 * Throws an error when transporter isn't configured or when sending fails.
 */
async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    throw new Error("SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env");
  }
  if (!transporterReady) {
    console.warn("SMTP transporter not verified. Attempting to send anyway...");
  }

  try {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    const previewUrl = nodemailer.getTestMessageUrl(info); // works with Ethereal
    if (previewUrl) console.log("Preview URL:", previewUrl);
    // return plain object (avoid circular)
    return { info: { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected }, previewUrl };
  } catch (err) {
    console.warn("sendMail threw:", err && (err.message || err));
    // rethrow so caller can decide what to do (we want handler to respond)
    throw err;
  }
}

module.exports = { sendMail, transporter, transporterReady };
