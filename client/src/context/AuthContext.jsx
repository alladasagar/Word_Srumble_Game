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
