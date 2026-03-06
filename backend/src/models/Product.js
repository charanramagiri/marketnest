const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: String
    },

    images: [
      {
        type: String
      }
    ],

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },

    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);