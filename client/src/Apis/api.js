import axios from "axios";

const BaseUrl = "https://word-srumble-game.onrender.com/api/auth";

export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await fetch("https://word-srumble-game.vercel.app/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch user");

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};





// Normal SignUp
export const SignUp = async (data) => {
  try {
    const response = await axios.post(`${BaseUrl}/signup`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Google Sign-Up
export const GoogleSignUp = async (data) => {
  try {
    const response = await axios.post(`${BaseUrl}/google`, data);
    return response.data;
  } catch (error) {
    console.error("Google Sign-Up API Error:", error.response?.data || error);
    return null;
  }
};
export const signin = async (data) => {
  console.log("Data sent to API:", data);
  try {
    const response = await axios.post(`${BaseUrl}/signin`, data);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signin API Error:", error.response?.data || error.message);
    return null;
  }
};


export const GoogleSignIn = async (data) => {
  try {
    const response = await fetch(`${BaseUrl}/google-signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.token) {
      localStorage.setItem("token", result.token); // Save token
    }

    return result;
  } catch (error) {
    console.error("Google Sign-In API Error:", error);
    return null;
  }
};


export const checkUsernameAvailability = async (username) => {
  console.log("Username to check:", username);
  try {
    const response = await axios.get(`${BaseUrl}/check-username/${username}`);
    return response.data;
  } catch (error) {
    console.error("Username availability API Error:", error.response?.data || error);
    return null;
  }
};

