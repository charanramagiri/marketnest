import API from "./client";

const getProducts = (params = {}) => API.get("/marketplace/products", { params });
const getProductDetails = (id) => API.get(`/marketplace/products/${id}`);

export {
  getProducts,
  getProductDetails,
};
