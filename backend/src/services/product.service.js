const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const { escapeRegex } = require("../utils/regex");
const { uploadFilesToCloudinary } = require("./cloudinary.service");

const MAX_IMAGES = 5;

const parseKeepExistingImages = (rawKeep) => {
  if (Array.isArray(rawKeep)) return rawKeep;
  if (typeof rawKeep !== "string") return [];

  try {
    const parsed = JSON.parse(rawKeep);
    return Array.isArray(parsed) ? parsed : [rawKeep];
  } catch {
    return rawKeep ? [rawKeep] : [];
  }
};

const createProduct = async ({ body, files, user }) => {
  const imageUrls = await uploadFilesToCloudinary(files || []);

  if (imageUrls.length > MAX_IMAGES) {
    throw new ApiError(400, `Maximum ${MAX_IMAGES} images are allowed per product`);
  }

  return Product.create({
    ...body,
    images: imageUrls,
    brandId: user.id
  });
};

const updateProduct = async ({ productId, body, files, user }) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.brandId.toString() !== user.id) {
    throw new ApiError(403, "Not authorized");
  }

  const updatableFields = ["name", "description", "price", "category", "status", "isArchived"];

  updatableFields.forEach((field) => {
    if (body[field] !== undefined) {
      product[field] = body[field];
    }
  });

  const hasKeepExistingImages = body.keepExistingImages !== undefined;
  const hasNewImages = files && files.length > 0;

  if (hasKeepExistingImages || hasNewImages) {
    const keepExistingImages = hasKeepExistingImages
      ? parseKeepExistingImages(body.keepExistingImages)
      : product.images || [];
    const allowedExisting = new Set(product.images || []);
    const sanitizedExisting = keepExistingImages.filter((url) => allowedExisting.has(url));
    const uploadedImages = await uploadFilesToCloudinary(files || []);
    const mergedImages = [...sanitizedExisting, ...uploadedImages];

    if (mergedImages.length > MAX_IMAGES) {
      throw new ApiError(400, `Maximum ${MAX_IMAGES} images are allowed per product`);
    }

    product.images = mergedImages;
  }

  await product.save();
  return product;
};

const archiveProduct = async ({ productId, user }) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.brandId.toString() !== user.id) {
    throw new ApiError(403, "Not authorized");
  }

  product.isArchived = true;
  await product.save();
};

const getMyProducts = async ({ user, scope }) => {
  const query = { brandId: user.id };

  if (scope === "archived") {
    query.isArchived = true;
  } else if (scope !== "all") {
    query.isArchived = false;
  }

  return Product.find(query).sort({ updatedAt: -1 });
};

const getDashboard = async ({ user }) => {
  const brandId = user.id;
  const [totalProducts, published, archived] = await Promise.all([
    Product.countDocuments({ brandId }),
    Product.countDocuments({ brandId, status: "published" }),
    Product.countDocuments({ brandId, isArchived: true })
  ]);

  return { totalProducts, published, archived };
};

const getMarketplaceProducts = async ({ search, category, page, limit }) => {
  const query = {
    status: "published",
    isArchived: false
  };

  if (search) {
    query.name = { $regex: escapeRegex(search), $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("brandId", "name"),
    Product.countDocuments(query)
  ]);

  return { total, page, limit, products };
};

const getMarketplaceProductDetails = async (productId) => {
  const product = await Product.findById(productId).populate("brandId", "name");

  if (!product || product.isArchived || product.status !== "published") {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

module.exports = {
  createProduct,
  updateProduct,
  archiveProduct,
  getMyProducts,
  getDashboard,
  getMarketplaceProducts,
  getMarketplaceProductDetails
};
