const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validate.middleware");
const productValidation = require("../validations/product.validation");


router.post(
  "/",
  authMiddleware,
  roleMiddleware("brand"),
  upload.array("images", 5),
  validate(productValidation.productPayload),
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("brand"),
  upload.array("images", 5),
  validate(productValidation.validateObjectId),
  validate(productValidation.productPayload),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("brand"),
  validate(productValidation.validateObjectId),
  productController.deleteProduct
);

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("brand"),
  productController.dashboard
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("brand"),
  validate(productValidation.productScope),
  productController.getMyProducts
);

module.exports = router;
