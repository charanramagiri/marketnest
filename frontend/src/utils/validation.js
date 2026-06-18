const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const passwordMessage =
  "Password must contain at least 8 characters, uppercase, lowercase, number and special character";

function validateEmail(email) {
  if (!emailRegex.test(String(email || "").trim())) {
    return "Please enter a valid email";
  }
  return null;
}

function validatePassword(password) {
  if (!passwordRegex.test(password || "")) {
    return passwordMessage;
  }
  return null;
}

function validateSignupForm(form) {
  if (!form.name.trim()) return "Name is required";

  const emailError = validateEmail(form.email);
  if (emailError) return emailError;

  const passwordError = validatePassword(form.password);
  if (passwordError) return passwordError;

  if (form.password !== form.confirmPassword) {
    return "Passwords do not match";
  }

  return null;
}

function validateResetPassword(password, confirmPassword) {
  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
}

export {
  validateEmail,
  validatePassword,
  validateSignupForm,
  validateResetPassword,
};
