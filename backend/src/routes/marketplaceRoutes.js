const express = require("express");
const router = express.Router();

const marketplaceController = require("../controllers/marketplaceController");
const validate = require("../middleware/validate.middleware");
const marketplaceValidation = require("../validations/marketplace.validation");

router.get("/products", validate(marketplaceValidation.listProducts), marketplaceController.getProducts);

router.get(
  "/products/:id",
  validate(marketplaceValidation.productDetails),
  marketplaceController.getProductDetails
);

module.exports = router;
