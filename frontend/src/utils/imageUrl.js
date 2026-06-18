const backendOrigin =
  import.meta.env.VITE_BACKEND_ORIGIN || "https://marketnest-backend-htxq.onrender.com";

function resolveImageUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${backendOrigin}${value.startsWith("/") ? "" : "/"}${value}`;
}

export { resolveImageUrl };
