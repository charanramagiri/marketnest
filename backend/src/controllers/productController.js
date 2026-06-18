const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const productService = require("../services/product.service");

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct({
    body: req.body,
    files: req.files,
    user: req.user
  });

  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct({
    productId: req.params.id,
    body: req.body,
    files: req.files,
    user: req.user
  });

  res.json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  await productService.archiveProduct({
    productId: req.params.id,
    user: req.user
  });

  sendSuccess(res, null, "Product archived successfully");
});

exports.getMyProducts = asyncHandler(async (req, res) => {
  const products = await productService.getMyProducts({
    user: req.user,
    scope: req.query.scope
  });

  res.json(products);
});

exports.dashboard = asyncHandler(async (req, res) => {
  const data = await productService.getDashboard({ user: req.user });
  res.json(data);
});
