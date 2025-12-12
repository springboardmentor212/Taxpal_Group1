// src/utils/mailer.js
const nodemailer = require('nodemailer');

let transporter;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} else {
  transporter = null;
}

async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    console.log('Mailer: SMTP not configured, skipping send. DEV only: ', { to, subject, text });
    return;
  }
  return transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html
  });
}

module.exports = { sendMail };
