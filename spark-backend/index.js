const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user.route");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const device = require("express-device");

dotenv.config();
const PORT = process.env.PORT || 3000;

// Middleware Setup
app.use(cors());
app.use(device.capture());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.send("Hello from the Linktree backend!");
});

app.set("trust proxy", true);

// Server and Database Connection
app.listen(PORT, () => {
  console.log("Server started on port:", PORT);
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
});
