const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("brand"),
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("brand"),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("brand"),
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
  productController.getMyProducts
);

module.exports = router;