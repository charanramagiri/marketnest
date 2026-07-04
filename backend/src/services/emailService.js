const emailClient = require("../config/email");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const sendEmail = async (to, subject, html) => {
  try {
    if (emailClient.provider === "brevo") {
      await emailClient.client.transactionalEmails.sendTransacEmail({
        sender: {
          email: env.email.from
        },
        to: [
          {
            email: to
          }
        ],
        subject,
        htmlContent: html
      });

      return;
    }

    await emailClient.client.sendMail({
      from: env.email.from,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("Failed to send email:", error.message);

    throw new ApiError(
      503,
      "Unable to send verification email. Please try again later."
    );
  }
};

module.exports = {
  sendEmail
};
