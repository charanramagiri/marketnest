const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },

    otp: {
      type: String,
      required: true
    },

    purpose: {
      type: String,
      enum: ["signup", "reset-password"],
      required: true
    },
    
    isVerified: {
      type: Boolean,
      default: false
    },

    // Only used during signup

    name: {
      type: String
    },

    password: {
      type: String
    },

    role: {
      type: String,
      enum: ["brand", "customer"]
    },

    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Otp", otpSchema);