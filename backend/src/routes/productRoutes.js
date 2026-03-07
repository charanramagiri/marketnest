const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware"); // add this line


router.post(
  "/",
  authMiddleware,
  roleMiddleware("brand"),
  upload.array("images", 5), // add this line
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