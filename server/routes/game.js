const express = require("express");
const User = require("../models/user");
const router = express.Router();

// Update score only if the new score is higher
router.post("/update-score", async (req, res) => {
  try {
    const { email, score } = req.body;
    console.log("Backend: Received Email:", email, "Score:", score);

    if (!email || score === undefined) {
      return res.status(400).json({ message: "Email and Score are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.hasPlayed = true;

    // Update only if the new score is higher
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


// Optimized Leaderboard Route with Rank Calculation
router.get("/leaderboard", async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch paginated leaderboard excluding users who never played
    const leaderboard = await User.aggregate([
      { $match: { hasPlayed: true } }, // Only include users who have played
      { $sort: { score: -1, updatedAt: 1 } },
      {
        $setWindowFields: {
          sortBy: { score: -1 },
          output: { rank: { $documentNumber: {} } },
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      { $project: { username: 1, score: 1, rank: 1 } },
    ]);

    // Get total count of users who have played at least once
    const totalUsers = await User.countDocuments({ hasPlayed: true });

    // Find the logged-in user's rank
    let userRank = null;
    if (userId) {
      const userRankData = await User.aggregate([
        { $match: { hasPlayed: true } }, // Ensure only players are ranked
        { $sort: { score: -1, updatedAt: 1 } },
        {
          $setWindowFields: {
            sortBy: { score: -1 },
            output: { rank: { $documentNumber: {} } },
          },
        },
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        { $project: { rank: 1 } },
      ]);
      userRank = userRankData.length ? userRankData[0].rank : null;
    }

    res.status(200).json({ leaderboard, userRank, totalUsers });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
