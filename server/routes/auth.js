const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();



// Register Route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Google Sign-In Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Auth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

// Manual Google Sign-In
router.post("/google", async (req, res) => {
    try {
      const { username, email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      let user = await User.findOne({ email });
  
      if (!user) {
        user = new User({
          username,
          email,
          password: "",
        });
        await user.save();
      }
      else{
        return res.status(400).json({ message: "User already exists" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ token, user });
  
    } catch (error) {
      console.error("Google Sign-Up Backend Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`http://localhost:5173/home?token=${token}`);
  }
);

module.exports = router;


