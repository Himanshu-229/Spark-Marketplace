const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const User = require("../models/user.model");
const LinkModel = require("../models/link.model"); // renamed model for Linktree-like links
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const shortid = require("shortid");
const device = require("express-device");
const UAParser = require("ua-parser-js");
const mongoose = require("mongoose");

dotenv.config();
router.use(express.json());

/* 
  1. Landing Page 
  (A basic public endpoint – in a real-world app, this may serve static HTML or integrate with a frontend)
*/
router.get("/landing", (req, res) => {
  res.status(200).json({
    message:
      "Welcome to our Linktree-like Mini Link Management Platform! Enjoy exploring our features.",
  });
});

/* 
  2. Signup and Login 
*/

// Register a new user with basic validations (e.g. unique email, bcrypt hashing)
router.post("/register", async (req, res) => {
  const { username, email, mobile, password } = req.body;

  try {
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Additional validations (e.g. password strength) can be added here

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      email,
      mobile,
      password: hashedPassword,
      // Optionally, initialize additional fields like profilePicture, bannerImage, socialLinks, shopLinks, appearance, etc.
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: `${error}` });
  }
});

// GET /profile route to fetch user profile details
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User login with JWT authentication
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Secure cookie options can be configured as needed
    res.cookie("token", token);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* 
  3. Dashboard: Profile & Link Management
  Endpoints for creating, editing, deleting links as well as updating profile details.
*/

// Create a new link
router.post("/link", authMiddleware, async (req, res) => {
  const { originalLink, title, expirationdate } = req.body;
  const linkID = shortid();

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!originalLink) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const link = await LinkModel.create({
      linkId: linkID,
      redirectURL: originalLink,
      user: user._id,
      title: title,
      expirationdate: expirationdate ? new Date(expirationdate) : null,
      // Ensure your LinkModel includes an array for clicks and any other required fields.
    });

    res.status(201).json({
      message: "Link created successfully",
      id: linkID,
      redirectURL: originalLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Update an existing link
router.put("/link/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { originalLink, title, expirationdate } = req.body;

  try {
    const link = await LinkModel.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!link) {
      return res
        .status(404)
        .json({ message: "Link not found or unauthorized" });
    }

    if (originalLink) {
      link.redirectURL = originalLink;
    }

    if (title) {
      link.title = title;
    }

    if (expirationdate) {
      link.expirationdate = new Date(expirationdate);
    } else if (expirationdate === null) {
      link.expirationdate = null; // Allow removing expiration date
    }

    await link.save();

    res.status(200).json({
      message: "Link updated successfully",
      data: link,
    });
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Delete a link
router.delete("/link/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const link = await LinkModel.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!link) {
      return res
        .status(404)
        .json({ message: "Link not found or unauthorized" });
    }

    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Get paginated list of user's links
router.get("/link", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const totalCount = await LinkModel.countDocuments({
      user: req.user.id,
    });

    const links = await LinkModel.find({ user: req.user.id })
      .skip(skip)
      .limit(limit);

    if (!links || links.length === 0) {
      return res
        .status(404)
        .json({ message: "No links found for this user" });
    }

    res.status(200).json({
      message: "User links fetched successfully",
      data: links,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/* 
  4. Appearance Section 
  Allow users to customize the look and feel of their profile page.
  (Assumes that the User model has an "appearance" object field.)
*/
router.put("/appearance", authMiddleware, async (req, res) => {
  const { theme, buttonDesign, layout } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Save/update appearance settings on the user document
    user.appearance = { theme, buttonDesign, layout };
    await user.save();

    res.status(200).json({
      message: "Appearance settings updated successfully",
      data: user.appearance,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/* 
  5. Analytics Page 
  Provide aggregated analytics data for a user's links.
  This endpoint aggregates total clicks, unique views (based on IP and device),
  and a basic device breakdown.
*/
router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const links = await LinkModel.find({ user: req.user.id });
    if (!links || links.length === 0) {
      return res.status(404).json({ message: "No links found for this user" });
    }

    const analytics = links.map((link) => {
      const totalClicks = link.clicks.length;

      // Compute unique clicks using a combination of ipAddress and device.
      const uniqueClicks = {};
      link.clicks.forEach((click) => {
        const key = `${click.ipAddress}-${click.device}`;
        uniqueClicks[key] = true;
      });
      const uniqueViews = Object.keys(uniqueClicks).length;

      // Device breakdown
      let deviceBreakdown = {};
      link.clicks.forEach((click) => {
        deviceBreakdown[click.device] = (deviceBreakdown[click.device] || 0) + 1;
      });

      return {
        linkId: link.linkId,
        title: link.title,
        totalClicks,
        uniqueViews,
        deviceBreakdown,
      };
    });

    res.status(200).json({
      message: "Analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/* 
  6. Settings Page 
  Allow users to update profile details and change password.
  The /update endpoint now supports additional profile fields.
*/
router.put("/update", authMiddleware, async (req, res) => {
  // Additional fields added for profile customization (e.g., profilePicture, bannerImage, socialLinks, shopLinks)
  const {
    username,
    email,
    mobile,
    profilePicture,
    bannerImage,
    socialLinks,
    shopLinks,
  } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (profilePicture) user.profilePicture = profilePicture;
    if (bannerImage) user.bannerImage = bannerImage;
    if (socialLinks) user.socialLinks = socialLinks;
    if (shopLinks) user.shopLinks = shopLinks;

    await user.save();
    res.status(200).json({
      message: "User information updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Endpoint for changing password
router.put("/settings/password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/* 
  7. Logout Feature 
  Provide an endpoint to end the user session by clearing the authentication cookie.
*/
router.post("/logout", authMiddleware, (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

/* 
  Public Route: Redirect based on linkId 
  (Also logs click details including referrer. Geographic location can be integrated using external services.)
*/
router.get("/:linkId", async (req, res) => {
  const linkId = req.params.linkId;

  try {
    const entry = await LinkModel.findOne({ linkId });

    if (!entry) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check if the link has expired
    if (entry.expirationdate && new Date(entry.expirationdate) < new Date()) {
      return res.status(410).json({ message: "This link has expired." });
    }

    // Log click details
    const ipAddress = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0].trim()
      : req.ip;
    const deviceType = req.device.type;
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser();
    const result = parser.setUA(userAgent).getResult();
    const os = result.os.name;
    const referrer = req.headers["referer"] || "Direct";

    await LinkModel.findOneAndUpdate(
      { linkId },
      {
        $push: {
          clicks: {
            timestamp: Date.now(),
            ipAddress: ipAddress,
            device: deviceType,
            os: os,
            referrer: referrer, // captured referrer for analytics
          },
        },
      },
      { new: true }
    );

    // Redirect to the original URL
    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error in redirect route:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Delete user and all related links (account deletion)
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await LinkModel.deleteMany({ user: req.user.id });
    res
      .status(200)
      .json({ message: "User and related data deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Search links by title (for dashboard search functionality)
router.get("/search", authMiddleware, async (req, res) => {
  const { query } = req.query;

  try {
    if (!query || query.trim() === "") {
      console.log("Query is missing or empty");
      return res.status(400).json({ message: "Search query is required" });
    }

    const filter = {
      user: req.user.id,
      title: { $regex: query, $options: "i" },
    };

    const results = await LinkModel.find(filter);

    if (results.length === 0) {
      return res.status(404).json({ message: "No matching links found" });
    }

    res.status(200).json({
      message: "Search results fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error in /search route:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
