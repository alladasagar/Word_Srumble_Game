import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signin, GoogleSignIn } from "../Apis/api";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../utils/Spinner"; 

export default function SignInForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [UserData, setUserData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); 

  const handlelogin = async (e) => {
    e.preventDefault();
  
    if (!UserData.email || !UserData.password) {
      toast.error("All fields are required!");
      return;
    }
  
    setLoading(true); 
    console.log("At Frontend:", UserData);
  
    try {
      const response = await signin(UserData);
      
      if (response && response.token) {
        toast.success("Signin successful!");
        
        login(UserData, response.token);
  
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      console.error("Sign-In Error:", error);
      toast.error("An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      console.log("Google signin clicked");

      try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const userData = { username: response.data.name, email: response.data.email };

        const serverResponse = await GoogleSignIn(userData);

        if (serverResponse && serverResponse.token) {
          toast.success("Google Sign-In Successful!");
          login(userData, serverResponse.token);
          setTimeout(() => navigate("/"), 2000);
        } else {
          toast.error(response?.message || "Google Sign-In failed");
        }
      } catch (error) {
        toast.error("Google Sign-In Failed. Try again.");
      } finally {
        setLoading(false); 
      }
    },
    onError: (error) => {
      toast.error("Google Sign-In failed.");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign in</h2>

        {loading ? (
          <div className="flex justify-center mt-6">
            <Spinner />
          </div>
        ) : (
          <form className="mt-6" onSubmit={handlelogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="Email"
                value={UserData.email} 
                onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="Password"
                onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Signing in"}
            </button>
          </form>
        )}

        {!loading && (
          <div className="mt-4">
            <button
              className="w-full flex items-center justify-center px-4 py-2 bg-white border rounded-lg"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
