const asyncHandler = require("../utils/asyncHandler");
const productService = require("../services/product.service");

exports.getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getMarketplaceProducts(req.query);
  res.json(result);
});

exports.getProductDetails = asyncHandler(async (req, res) => {
  const product = await productService.getMarketplaceProductDetails(req.params.id);
  res.json(product);
});
