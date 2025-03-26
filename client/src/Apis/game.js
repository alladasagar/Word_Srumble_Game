import axios from "axios";

const BaseUrl = "https://word-srumble-game.onrender.com/api/game";

export const sendScore = async ({ email, score }) => {
  try {
    console.log("API: Sending Score:", email, score);
    const response = await axios.post(`${BaseUrl}/update-score`, { email, score });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending score:", error.response?.data || error.message);
    return null;
  }
};


export const getLeaderboard = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${BaseUrl}/leaderboard`, {
      params: { userId, page, limit },
    });
    return response.data; // Should return { leaderboard, userRank, totalUsers }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { leaderboard: [], userRank: null, totalUsers: 0 };
  }
};

  