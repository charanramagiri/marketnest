const transporter = require("../config/email");
const env = require("../config/env");

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: env.email.user,
    to,
    subject,
    html
  });
};

module.exports = {
  sendEmail
};
