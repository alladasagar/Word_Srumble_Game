const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const passport = require("passport"); // ✅ Keep only this import
require("./config/passport"); // ✅ Just require the file to execute its setup, don't reassign passport
const cookieParser = require("cookie-parser");



dotenv.config();

const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");

const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = ["https://word-srumble-game.vercel.app/"]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(passport.initialize()); // Initialize Passport
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
