const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.post("/update-score", async (req, res) => {
  try {
    const { userId, score } = req.body;
    console.log("Backend: User ID:", userId, "Score:", score);

    if (!userId || score === undefined) {
      return res.status(400).json({ message: "User ID and Score are required" });
    }

    // Fetch the existing user score
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only if the new score is greater than the existing score
    if (user.score < score) {
      user.score = score;
      await user.save();
      return res.status(200).json({ message: "Score updated successfully", user });
    } 

    res.status(200).json({ message: "New score is not higher, no update made", user });

  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get leaderboard (paginated)
router.get("/leaderboard", async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch paginated leaderboard players
    const leaderboard = await User.find({})
      .sort({ score: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("username score updatedAt");

    // Get total user count
    const totalUsers = await User.countDocuments();

    let userRank = null;
    if (userId) {
      // Find the rank of the logged-in user
      const allUsers = await User.find({}).sort({ score: -1 }).select("_id");
      userRank = allUsers.findIndex(user => user._id.toString() === userId) + 1;
    }

    res.status(200).json({ leaderboard, userRank, totalUsers });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;
