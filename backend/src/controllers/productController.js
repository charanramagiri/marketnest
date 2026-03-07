const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

exports.createProduct = async (req, res) => {
  try {

    const { name, description, price, category, status } = req.body;

    const imageUrls = [];

    if (req.files && req.files.length > 0) {

      for (const file of req.files) {

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

    }

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

    Object.assign(product, req.body);

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

  const products = await Product.find({
    brandId: req.user.id,
    isArchived: false
  });

  res.json(products);
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