const Product = require("../models/Product");

exports.getProducts = async (req, res) => {

  try {

    const { search, category, page = 1, limit = 10 } = req.query;

    const query = {
      status: "published",
      isArchived: false
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("brandId", "name");

    const total = await Product.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      products
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }

};

exports.getProductDetails = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id)
      .populate("brandId", "name");

    if (!product || product.isArchived || product.status !== "published") {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }

};