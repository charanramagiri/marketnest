const nodemailer = require("nodemailer");
const env = require("./env");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: env.email.user,
    pass: env.email.pass
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

if (process.env.VERIFY_EMAIL_TRANSPORT === "true") {
  transporter.verify((error) => {
    if (error) {
      console.log("EMAIL ERROR:", error);
    } else {
      console.log("Email server ready");
    }
  });
}

module.exports = transporter;
