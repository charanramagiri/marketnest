const mongoose = require("mongoose");

const normalizeString = (value) => String(value || "").trim();
const validStatuses = ["draft", "published"];

const parseBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return value;
};

const validateObjectId = ({ params }) => {
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return { error: "Invalid product id" };
  }

  return { params };
};

const productPayload = ({ body, params }) => {
  const normalized = {
    name: body.name !== undefined ? normalizeString(body.name) : undefined,
    description: body.description !== undefined ? normalizeString(body.description) : undefined,
    price: body.price !== undefined ? Number(body.price) : undefined,
    category: body.category !== undefined ? normalizeString(body.category) : undefined,
    status: body.status !== undefined ? normalizeString(body.status) : undefined,
    isArchived: body.isArchived !== undefined ? parseBoolean(body.isArchived) : undefined,
    keepExistingImages: body.keepExistingImages
  };

  const isCreate = !params?.id;

  if (isCreate && !normalized.name) return { error: "Product name is required" };
  if (isCreate && !normalized.description) return { error: "Description is required" };
  if (isCreate && !normalized.category) return { error: "Category is required" };
  if (isCreate && (Number.isNaN(normalized.price) || normalized.price <= 0)) {
    return { error: "Price must be greater than 0" };
  }

  if (normalized.name !== undefined && !normalized.name) return { error: "Product name is required" };
  if (normalized.description !== undefined && !normalized.description) return { error: "Description is required" };
  if (normalized.category !== undefined && !normalized.category) return { error: "Category is required" };
  if (normalized.price !== undefined && (Number.isNaN(normalized.price) || normalized.price <= 0)) {
    return { error: "Price must be greater than 0" };
  }
  if (normalized.status !== undefined && !validStatuses.includes(normalized.status)) {
    return { error: "Invalid product status" };
  }
  if (normalized.isArchived !== undefined && typeof normalized.isArchived !== "boolean") {
    return { error: "Invalid archive status" };
  }

  Object.keys(normalized).forEach((key) => {
    if (normalized[key] === undefined) {
      delete normalized[key];
    }
  });

  return { body: normalized, params };
};

const productScope = ({ query }) => {
  const scope = normalizeString(query.scope);

  if (scope && !["all", "archived"].includes(scope)) {
    return { error: "Invalid product scope" };
  }

  return { query: { scope } };
};

module.exports = {
  validateObjectId,
  productPayload,
  productScope
};
