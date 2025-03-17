const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const passport = require("passport");
require("./config/passport"); // Ensure passport config loads

dotenv.config();

const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize()); // Initialize Passport

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes); 

app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
