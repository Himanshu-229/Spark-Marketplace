const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    linkId: {
      type: String,
      unique: true,
      required: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    clicks: [
      {
        timestamp: { type: Date },
        ipAddress: { type: String }, // IP address of the user
        device: { type: String },    // e.g., Mobile, Desktop
        os: { type: String },        // e.g., iOS, Windows, Android
        referrer: { type: String },  // Referring URL, e.g., social media, direct, etc.
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
    },
    expirationdate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const LinkModel = mongoose.model("Link", linkSchema);
module.exports = LinkModel;
