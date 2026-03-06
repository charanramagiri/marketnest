const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes"); // ADD THIS

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/marketplace", marketplaceRoutes); // ADD THIS

app.get("/", (req, res) => {
  res.send("MarketNest API running");
});

module.exports = app;