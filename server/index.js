const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const passport = require("passport");
require("./config/passport"); // Ensure Passport is configured
const cookieParser = require("cookie-parser");

dotenv.config();

const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");

const app = express();

// ✅ Improved Allowed Origins (Fixing CORS issues)
const allowedOrigins = [
  "https://word-srumble-game.vercel.app",
  "http://localhost:5173" // Allow local frontend during development
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Security Headers Fix (Prevents iframe & cross-origin issues)
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// ✅ Initialize Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

// ✅ Improved Database Connection Handling
connectDB().catch((err) => {
  console.error("❌ Database Connection Failed:", err);
  process.exit(1); // Exit if DB connection fails
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
