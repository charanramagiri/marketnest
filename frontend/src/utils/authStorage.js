const TOKEN_KEY = "token";
const ROLE_KEY = "role";

function decodeJwtPayload(token) {
  try {
    if (!token || !token.includes(".")) return null;
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (normalized.length % 4)) % 4;
    const base64 = `${normalized}${"=".repeat(padLength)}`;
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token && isTokenExpired(token)) {
    clearAuth();
    return null;
  }

  return token;
}

function getRole() {
  getToken();
  return localStorage.getItem(ROLE_KEY);
}

function getRoleFromToken(token) {
  const payload = decodeJwtPayload(token);
  const role = payload?.role;
  return role === "brand" || role === "customer" ? role : null;
}

function setAuth({ token, role }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role || getRoleFromToken(token) || "");
  }
}

function setAuthToken(token) {
  setAuth({ token });
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

function isAuthenticated() {
  return Boolean(getToken());
}

export {
  getToken,
  getRole,
  setAuth,
  setAuthToken,
  clearAuth,
  isAuthenticated,
  decodeJwtPayload,
  getRoleFromToken,
  isTokenExpired,
};
