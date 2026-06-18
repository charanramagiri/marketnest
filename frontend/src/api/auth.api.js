import API from "./client";

const signup = (payload) => API.post("/auth/signup", payload);
const login = (payload) => API.post("/auth/login", payload);
const logout = () => API.post("/auth/logout");
const verifyOtp = (payload) => API.post("/auth/verify-otp", payload);
const resendOtp = (payload) => API.post("/auth/resend-otp", payload);
const forgotPassword = (payload) => API.post("/auth/forgot-password", payload);
const verifyResetOtp = (payload) => API.post("/auth/verify-reset-otp", payload);
const resetPassword = (payload) => API.post("/auth/reset-password", payload);

export {
  signup,
  login,
  logout,
  verifyOtp,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};
