import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token from localStorage:", token);
  
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        console.log("🛠️ Decoded Token:", decodedUser);
  
        if (decodedUser.exp * 1000 < Date.now()) {
          console.log("⚠️ Token expired. Logging out...");
          logout();
        } else {
          setUser({ _id: decodedUser._id || decodedUser.id, email: decodedUser.email });
          console.log("✅ User Authenticated:", { _id: decodedUser._id || decodedUser.id, email: decodedUser.email });
        }
      } catch (error) {
        console.error("❌ Invalid token:", error);
        logout();
      }
    }
  }, []);
  
  

  const login = (newUser, token) => {
    localStorage.setItem("token", token);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
