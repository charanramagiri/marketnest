const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/marketplace", marketplaceRoutes);

app.get("/", (req, res) => {
  res.send("MarketNest API running");
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
