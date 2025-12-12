require("dotenv").config();
const { sendMail } = require("../src/mailer");

(async () => {
  try {
    const r = await sendMail({
      to: process.env.TEST_TO || process.env.SMTP_USER,
      subject: "TaxPal test email",
      text: "This is a test email from TaxPal",
      html: "<p>This is a <b>test</b> email from TaxPal</p>"
    });
    console.log("sendMail OK:", JSON.stringify(r, null, 2));
  } catch (err) {
    console.error("sendMail ERR:", err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
  }
})();
