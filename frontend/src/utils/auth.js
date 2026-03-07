const TOKEN_KEY = "token";
const ROLE_KEY = "role";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

function setAuth({ token, role }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

function decodeJwtPayload(token) {
  try {
    if (!token || !token.includes(".")) return null;
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (normalized.length % 4)) % 4;
    const base64 = `${normalized}${"=".repeat(padLength)}`;
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getRoleFromToken(token) {
  const payload = decodeJwtPayload(token);
  const role = payload?.role;
  if (role === "brand" || role === "customer") return role;
  return null;
}

function isAuthenticated() {
  return Boolean(getToken());
}

export {
  getToken,
  getRole,
  setAuth,
  clearAuth,
  isAuthenticated,
  decodeJwtPayload,
  getRoleFromToken,
};
