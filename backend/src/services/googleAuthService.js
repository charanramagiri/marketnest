const { OAuth2Client } = require("google-auth-library");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const client = new OAuth2Client(env.googleClientId);

const verifyGoogleToken = async (credential) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId
    });

    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      throw new ApiError(401, "Google email is not verified");
    }

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub
    };
  } catch (error) {
    throw new ApiError(401, "Invalid Google token");
  }
};

module.exports = {
  verifyGoogleToken
};