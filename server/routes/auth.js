const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();


// Middleware to verify token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ Corrected Route (Using 'router' instead of 'app')

router.get("/getUser", authenticateUser, async (req, res) => {
  console.log("Fetching user data at backend");
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});




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
// Google OAuth (Remove this duplicate set)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`https://word-srumble-game.vercel.app/home?token=${token}`);
  }
);


// Manual Google Sign-up
router.post("/google", async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8); 
      const hashedPassword = await bcrypt.hash(randomPassword, 10); 

      user = new User({
        username,
        email,
        password: hashedPassword, // Store hashed password
      });
      await user.save();
    } else {
      return res.status(400).json({ message: "User already exists" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ 
      token, 
      user: { id: user._id, email: user.email }
  });

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
    res.redirect(`https://word-srumble-game.vercel.app/home?token=${token}`);
  }
);

// Google Sign-In Route
router.post("/google-signin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist. Please sign up first." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Includes both id and email
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated JWT Token:", token); // Debugging

    res.json({ 
      message: "Google Sign-In successful", 
      token, 
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Google Sign-In Backend Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Sign-In Request:", req.body);

    // Check if user exists
    const user = await User.findOne({ email });
    console.log("User Found:", user);

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Include email in JWT payload
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Now includes email
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated Token:", token);

    res.json({ token, user });

  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});




router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Username received at backend", username);
    const user = await User.findOne({ username: { $regex: `^${username}$`, $options: "i" } });

    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    } else {
      return res.status(200).json({ message: "Username available" });
    }
  } catch (error) {  
    console.error("Check Username Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;


