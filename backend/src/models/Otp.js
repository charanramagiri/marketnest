const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },

    otpHash: {
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

    attempts: {
      type: Number,
      default: 0
    },

    resendAvailableAt: {
      type: Date
    },

    resetTokenHash: {
      type: String
    },

    resetTokenExpiresAt: {
      type: Date
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

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);
