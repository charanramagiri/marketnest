const mongoose = require("mongoose");

const normalizeString = (value) => String(value || "").trim();

const listProducts = ({ query }) => {
  const page = Math.max(1, Number.parseInt(query.page || "1", 10));
  const limit = Math.min(50, Math.max(1, Number.parseInt(query.limit || "10", 10)));

  return {
    query: {
      search: normalizeString(query.search),
      category: normalizeString(query.category),
      page: Number.isNaN(page) ? 1 : page,
      limit: Number.isNaN(limit) ? 10 : limit
    }
  };
};

const productDetails = ({ params }) => {
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return { error: "Invalid product id" };
  }

  return { params };
};

module.exports = {
  listProducts,
  productDetails
};
