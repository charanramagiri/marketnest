const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const uploadFilesToCloudinary = async (files = []) => {
  const imageUrls = [];

  for (const file of files) {
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "marketnest-products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    imageUrls.push(uploaded.secure_url);
  }

  return imageUrls;
};

exports.createProduct = async (req, res) => {
  try {

    const { name, description, price, category, status } = req.body;

    const imageUrls = await uploadFilesToCloudinary(req.files || []);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      status,
      images: imageUrls,
      brandId: req.user.id
    });

    res.status(201).json(product);

  } catch (error) {

    res.status(500).json({ message: "Product creation failed" });

  }
};


exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.brandId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatableFields = ["name", "description", "price", "category", "status", "isArchived"];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const hasKeepExistingImages = req.body.keepExistingImages !== undefined;
    const hasNewImages = req.files && req.files.length > 0;

    if (hasKeepExistingImages || hasNewImages) {
      let keepExistingImages = [];

      if (hasKeepExistingImages) {
        const rawKeep = req.body.keepExistingImages;

        if (Array.isArray(rawKeep)) {
          keepExistingImages = rawKeep;
        } else if (typeof rawKeep === "string") {
          try {
            const parsed = JSON.parse(rawKeep);
            keepExistingImages = Array.isArray(parsed) ? parsed : [rawKeep];
          } catch (error) {
            keepExistingImages = rawKeep ? [rawKeep] : [];
          }
        }
      } else {
        keepExistingImages = product.images || [];
      }

      const allowedExisting = new Set(product.images || []);
      const sanitizedExisting = keepExistingImages.filter((url) => allowedExisting.has(url));
      const uploadedImages = await uploadFilesToCloudinary(req.files || []);
      const mergedImages = [...sanitizedExisting, ...uploadedImages];

      if (mergedImages.length > 5) {
        return res.status(400).json({ message: "Maximum 5 images are allowed per product" });
      }

      product.images = mergedImages;
    }

    await product.save();

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.brandId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    product.isArchived = true;

    await product.save();

    res.json({ message: "Product archived successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};


exports.getMyProducts = async (req, res) => {
  try {
    const { scope } = req.query;

    const query = {
      brandId: req.user.id,
    };

    if (scope === "archived") {
      query.isArchived = true;
    } else if (scope === "all") {
      // no isArchived filter
    } else {
      query.isArchived = false;
    }

    const products = await Product.find(query).sort({ updatedAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch brand products" });
  }
};


exports.dashboard = async (req, res) => {

  const brandId = req.user.id;

  const totalProducts = await Product.countDocuments({ brandId });

  const published = await Product.countDocuments({
    brandId,
    status: "published"
  });

  const archived = await Product.countDocuments({
    brandId,
    isArchived: true
  });

  res.json({
    totalProducts,
    published,
    archived
  });
};
