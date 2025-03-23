import axios from "axios";

const BaseUrl = "http://localhost:5000/api/game";

export const sendScore = async ({ userId, score }) => {
  try {
      console.log("API: Sending Score:", userId, score);
      const response = await axios.post(`${BaseUrl}/update-score`, { userId, score });
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

  