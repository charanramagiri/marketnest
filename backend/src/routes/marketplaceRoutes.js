const express = require("express");
const router = express.Router();

const marketplaceController = require("../controllers/marketplaceController");

router.get("/products", marketplaceController.getProducts);

router.get("/products/:id", marketplaceController.getProductDetails);

module.exports = router;