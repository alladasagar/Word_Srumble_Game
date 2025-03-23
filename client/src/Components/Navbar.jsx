import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path ? "text-blue-600 font-bold" : "text-gray-700";

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
        Swal.fire("Logged Out", "You have been logged out.", "success");
      }
    });
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">WordScramble</div>

        <div className="hidden md:flex space-x-6">
          {user ? (
            <>
              <button onClick={() => navigate("/")} className={`text-xl ${isActive("/")}`}>
                Home
              </button>
              <button onClick={() => navigate("/game")} className={`text-xl ${isActive("/game")}`}>
                Play
              </button>
              <button onClick={() => navigate("/leaderboard")} className={`text-xl ${isActive("/leaderboard")}`}>
                Leaderboard
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-700 px-4 py-2 rounded-lg text-xl"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/")} className={`text-xl ${isActive("/")}`}>
                Home
              </button>
              <button onClick={() => navigate("/signin")} className="text-black px-4 py-2 rounded-lg text-xl">
                Sign In
              </button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-white p-4 shadow-lg">
          <button onClick={() => navigate("/")} className={`text-xl ${isActive("/")}`}>
            Home
          </button>
          {user ? (
            <>
              <button onClick={() => navigate("/game")} className={`text-xl ${isActive("/game")}`}>
                Play
              </button>
              <button onClick={() => navigate("/leaderboard")} className={`text-xl ${isActive("/leaderboard")}`}>
                Leaderboard
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-gray-700 px-4 py-2 rounded-lg text-xl"
              >
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/signin")} className="text-black px-4 py-2 rounded-lg text-xl">
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
