const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const otpRegex = /^\d{6}$/;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizeString = (value) => String(value || "").trim();

const validateEmail = (email) => {
  if (!emailRegex.test(email)) {
    return "Please enter a valid email";
  }
  return null;
};

const validatePassword = (password) => {
  if (!passwordRegex.test(password || "")) {
    return "Password must contain at least 8 characters, uppercase, lowercase, number and special character";
  }
  return null;
};

const signup = ({ body }) => {
  const normalized = {
    name: normalizeString(body.name),
    email: normalizeEmail(body.email),
    password: body.password,
    role: normalizeString(body.role)
  };

  if (!normalized.name) return { error: "Name is required" };

  const emailError = validateEmail(normalized.email);
  if (emailError) return { error: emailError };

  const passwordError = validatePassword(normalized.password);
  if (passwordError) return { error: passwordError };

  if (!["customer", "brand"].includes(normalized.role)) {
    return { error: "Invalid role selected" };
  }

  return { body: normalized };
};

const login = ({ body }) => {
  const normalized = {
    email: normalizeEmail(body.email),
    password: body.password
  };

  const emailError = validateEmail(normalized.email);
  if (emailError) return { error: emailError };

  if (!normalized.password) return { error: "Password is required" };

  return { body: normalized };
};

const emailOnly = ({ body }) => {
  const normalized = {
    email: normalizeEmail(body.email)
  };

  const emailError = validateEmail(normalized.email);
  if (emailError) return { error: emailError };

  return { body: normalized };
};

const verifyOtp = ({ body }) => {
  const normalized = {
    email: normalizeEmail(body.email),
    otp: normalizeString(body.otp)
  };

  const emailError = validateEmail(normalized.email);
  if (emailError) return { error: emailError };

  if (!otpRegex.test(normalized.otp)) {
    return { error: "OTP must be a 6 digit code" };
  }

  return { body: normalized };
};

const resetPassword = ({ body }) => {
  const normalized = {
    email: normalizeEmail(body.email),
    password: body.password,
    resetToken: normalizeString(body.resetToken)
  };

  const emailError = validateEmail(normalized.email);
  if (emailError) return { error: emailError };

  const passwordError = validatePassword(normalized.password);
  if (passwordError) return { error: passwordError };

  if (!normalized.resetToken) {
    return { error: "Reset token is required" };
  }

  return { body: normalized };
};

const googleLogin = ({ body }) => {
  const credential = normalizeString(body.credential);

  if (!credential) {
    return { error: "Google credential is required" };
  }

  return { body: { credential } };
};

const completeGoogleSignup = ({ body }) => {
  const credential = normalizeString(body.credential);
  const role = normalizeString(body.role);

  if (!credential) {
    return { error: "Google credential is required" };
  }

  if (!["customer", "brand"].includes(role)) {
    return { error: "Invalid role selected" };
  }

  return { body: { credential, role } };
};

module.exports = {
  signup,
  login,
  emailOnly,
  verifyOtp,
  resetPassword,
  googleLogin,
  completeGoogleSignup,
  validatePassword
};
