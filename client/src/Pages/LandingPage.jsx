import { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import Spinner from "../utils/Spinner"; // Import Spinner component

const LandingPage = ({ isAuthenticated }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 md:py-16 sm:py-12">
        {isAuthenticated ? (
          <div className="bg-blue-100 p-10 rounded-lg shadow-md w-full max-w-lg">
            <h1 className="text-3xl font-bold">Ready to Challenge Yourself?</h1>
            <p className="text-gray-600 mt-2">
              Join thousands of players testing their vocabulary and quick thinking.
            </p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg" 
            onClick={() => navigate("/game")}
            >
              Start Playing
            </button>
          </div>
        ) : (
          <>
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm md:text-base">
              Challenge Your Vocabulary
            </span>
            <h1 className="text-6xl font-bold mt-4 md:text-5xl sm:text-3xl xs:text-2xl m-2">
              Unscramble Words. Beat the Clock.
            </h1>
            <p className="text-gray-600 mt-2 max-w-xl md:max-w-lg sm:max-w-sm text-xl md:text-lg sm:text-base">
              A fast-paced word game that challenges your vocabulary and quick thinking. 
              Unscramble letters before time runs out!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
                onClick={() => navigate("/game")}
              >
                Start Play
              </button>
              <button className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-lg"
                onClick={() => navigate("/leaderboard")}
              >
                View Leaderboard
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-4xl font-bold">How It Works</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          WordScramble is a simple yet addictive word game that tests your vocabulary and quick thinking.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Word Challenge</h3>
            <p className="text-gray-600 mt-2">
              Test your vocabulary skills with a variety of scrambled words to solve.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Time Pressure</h3>
            <p className="text-gray-600 mt-2">
              Race against the clock to unscramble as many words as possible within the time limit.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Score Tracking</h3>
            <p className="text-gray-600 mt-2">
              Keep track of your scores and compete with others on the global leaderboard.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
