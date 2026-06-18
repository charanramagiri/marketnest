import API from "./client";

const createProduct = (payload) => API.post("/products", payload);
const updateProduct = (id, payload) => API.put(`/products/${id}`, payload);
const archiveProduct = (id) => API.delete(`/products/${id}`);
const getDashboard = () => API.get("/products/dashboard");
const getMyProducts = (params = {}) => API.get("/products/my", { params });

export {
  createProduct,
  updateProduct,
  archiveProduct,
  getDashboard,
  getMyProducts,
};
