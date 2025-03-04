const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    socketId: {
      type: String,
    },
    // New fields for Linktree-like customization
    profilePicture: {
      type: String, // URL to profile picture
    },
    bannerImage: {
      type: String, // URL to banner/cover image
    },
    socialLinks: {
      type: [String], // Array of social media URLs
    },
    shopLinks: {
      type: [String], // Array of shop/product URLs
    },
    appearance: {
      theme: { type: String },       // e.g., "light", "dark", etc.
      buttonDesign: { type: String },  // e.g., "rounded", "square", etc.
      layout: { type: String },        // e.g., "grid", "list", etc.
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
