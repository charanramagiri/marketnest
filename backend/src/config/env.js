const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const commonRequiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GOOGLE_CLIENT_ID"
];

const emailRequiredEnvVars = isProduction
  ? ["BREVO_API_KEY", "EMAIL_FROM"]
  : ["EMAIL_USER", "EMAIL_PASS"];

const requiredEnvVars = [
  ...commonRequiredEnvVars,
  ...emailRequiredEnvVars
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const defaultOrigins = [
  "http://localhost:5173",
  "https://marketnest-silk.vercel.app"
];

const allowedOrigins = (process.env.FRONTEND_ORIGIN || defaultOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  nodeEnv,
  isProduction,
  allowedOrigins,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    brevoApiKey: process.env.BREVO_API_KEY
  }
};
