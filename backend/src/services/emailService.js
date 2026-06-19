const transporter = require("../config/email");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: env.email.user,
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
