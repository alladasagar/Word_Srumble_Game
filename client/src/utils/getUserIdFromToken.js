import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token"); // Retrieve token
  if (!token) {
    console.error("No token found in localStorage.");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded); // Debugging line
    return decoded.id || decoded._id || null; // Ensure the correct key
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
