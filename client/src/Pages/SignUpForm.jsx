import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SignUp, GoogleSignUp, checkUsernameAvailability } from "../Apis/api";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../utils/Spinner"; 
import { useAuth } from "../context/AuthContext";

export default function SignUpForm() {
    const navigate = useNavigate();
    const [UserData, setUserData] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false); 
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [usernameMessage, setUsernameMessage] = useState("");

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!UserData.username || !UserData.email || !UserData.password) {
            toast.error("All fields are required!");
            return;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (!emailPattern.test(UserData.email)) {
            toast.error("Invalid email format!");
            return;
        }

        setLoading(true); 
        try {
            const response = await SignUp(UserData);
            console.log("Signup Response:", response);

            if (response && response.message === "User registered successfully") {
                toast.success("Signup successful!");
                login({ id: response.userId, email: UserData.email }, response.token);
                setTimeout(() => navigate("/"), 1000);
            } else {
                toast.error(response?.message || "User already exists");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            toast.error("Signup failed. Try again.");
        } finally {
            setLoading(false); 
        }
    };

    const handleGoogleSignUp = useGoogleLogin({
        onSuccess: async (tokenResponse) => { 
            setLoading(true); 
            console.log("✅ Google Sign-Up Triggered!");
            console.log("Google OAuth Token:", tokenResponse);
    
            try {
                const response = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                    }
                );
    
                const userData = { username: response.data.name, email: response.data.email };
    
                const serverResponse = await GoogleSignUp(userData);
                if (serverResponse?.token) {
                    toast.success("Google Sign-Up Successful!");
                    login({ id: serverResponse.userId, email: userData.email }, serverResponse.token);
                    setTimeout(() => navigate("/home"), 500);
                } else {
                    toast.error("User already exists.");
                }
            } catch (error) {
                toast.error("Google Sign-Up Failed.");
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            toast.error("Google Sign-Up failed.");
        },
        scope: "profile email openid",
    });
    


const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    if (newUsername.length < 5 || newUsername.length > 15) {
        setUsernameMessage("Username must be between 5 to 15 characters.");
        setUsernameAvailable(null);
    } else {
        setUsernameMessage("");
        setUserData((prev) => ({ ...prev, username: newUsername }));
    }
};

useEffect(() => {
    const checkAvailability = async () => {
        if (UserData.username.length >= 5 && UserData.username.length <= 10) {
            try {
                const response = await checkUsernameAvailability(UserData.username);
                setUsernameAvailable(response);
                setUsernameMessage(response ? "Username is available!" : "Username is already taken.");
            } catch (error) {
                setUsernameMessage("Error checking username. Try again.");
            }
        }
    };
    const timeoutId = setTimeout(checkAvailability, 500); 
    return () => clearTimeout(timeoutId); 
}, [UserData.username]);

return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900">Create an account</h2>

            {loading ? (
                <div className="flex justify-center mt-6">
                    <Spinner />
                </div>
            ) : (
                <form className="mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User Name</label>
                        <input
                            type="text"
                            name="username"
                            className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${usernameAvailable === null
                                ? "focus:ring-blue-500"
                                : usernameAvailable
                                    ? "bg-green-100 border-green-500 focus:ring-green-500"
                                    : "bg-red-100 border-red-500 focus:ring-red-500"
                                }`}
                            placeholder="Full Name (5-15 chars)"
                            onChange={handleUsernameChange}
                        />
                        {usernameMessage && (
                            <p className={`mt-1 text-sm ${usernameAvailable ? "text-green-600" : "text-red-600"}`}>
                                {usernameMessage}
                            </p>
                        )}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            type="email"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email address"
                            onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Password"
                            onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                        />
                    </div>
                    

                    <button
                        type="submit"
                        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                    <button
                        type="button"
                        className="w-full flex items-center mt-4 justify-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={() => {
                            console.log("🚀 Google Sign-Up Button Clicked!");
                            handleGoogleSignUp();
                        }}
                        disabled={loading}
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                        Sign up with Google
                    </button>
                </form>
            )}

            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <span
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate("/signin")}
                >
                    Sign in
                </span>
            </p>
        </div>
        <ToastContainer />
    </div>
);
}
