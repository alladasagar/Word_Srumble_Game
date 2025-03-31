import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const decodedUser = jwtDecode(token);

            if (decodedUser.exp * 1000 < Date.now()) {
                logout();
            } else {
                const userId = decodedUser._id || decodedUser.id || "";
                const userEmail = decodedUser.email || "";  

                setUser({ _id: userId, email: userEmail });
            }
        } catch (error) {
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
