const nodemailer = require("nodemailer");
const { BrevoClient } = require("@getbrevo/brevo");
const env = require("./env");

if (env.isProduction) {
  const brevo = new BrevoClient({
    apiKey: env.email.brevoApiKey,
    timeout: 30000,
    maxRetries: 2
  });

  module.exports = {
    provider: "brevo",
    client: brevo
  };
} else {
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

  module.exports = {
    provider: "smtp",
    client: transporter
  };
}
