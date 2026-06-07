const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateSignupData = ({
  name,
  email,
  password,
  role
}) => {

  if (!name?.trim()) {
    return "Name is required";
  }

  if (!emailRegex.test(email)) {
    return "Please enter a valid email";
  }

  if (!passwordRegex.test(password)) {
    return "Password must contain at least 8 characters, uppercase, lowercase, number and special character";
  }

  if (
    role !== "customer" &&
    role !== "brand"
  ) {
    return "Invalid role selected";
  }

  return null;
};

module.exports = {
  validateSignupData
};