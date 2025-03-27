import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../Apis/game";
import { useAuth } from "../context/AuthContext";
import Spinner from "../utils/Spinner"; 

const LeaderBoard = () => {
  const { user } = useAuth(); 
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true); // Start loading
      try {
        const data = await getLeaderboard(user?._id, page, usersPerPage);
        setLeaderboard(data.leaderboard);
        setUserRank(data.userRank);
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
      setLoading(false); // End loading
    };

    if (user) {
      fetchLeaderboard();
    }
  }, [user, page]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 ">
      <h1 className="text-3xl font-bold text-blue-600 mb-2 mt-4">Leaderboard</h1>
      <p className="text-gray-600 mb-4">See how you rank against other players</p>

      {/* Display User's Rank */}
      {user && userRank !== null && (
        <div className="bg-white p-4 shadow-md rounded-lg mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Rank: <span className="text-blue-600">{userRank}</span>
          </h2>
        </div>
      )}

      {/* Leaderboard Table or Loading Spinner */}
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner /> {/* Show Spinner while loading */}
          </div>
        ) : (
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200 text-gray-700 sticky top-0">
                <tr>
                  <th className="py-2 px-4 text-left">Rank</th>
                  <th className="py-2 px-4 text-left">Player</th>
                  <th className="py-2 px-4 text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => (
                  <tr
                    key={player._id}
                    className={`border-b hover:bg-gray-100 ${user?._id === player._id ? "text-blue-600 font-bold" : ""}`}
                  >
                    <td className="py-2 px-4">{(page - 1) * usersPerPage + index + 1}</td>
                    <td className="py-2 px-4">{player.username}</td>
                    <td className="py-2 px-4">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4 w-full max-w-3xl">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={page * usersPerPage >= totalUsers || loading}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeaderBoard;
