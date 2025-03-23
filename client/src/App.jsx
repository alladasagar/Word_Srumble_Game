import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import SignInForm from "./Pages/SignInForm";
import SignUpForm from "./Pages/SignUpForm";
import CallbackComponent from "./Components/CallbackComponent";
import Navbar from "./Components/Navbar";
import Game from "./Pages/Game";
import LeaderBoard from "./Pages/LeaderBoard";
import { AuthProvider } from "./context/AuthContext"; 
import ProtectedRoute from "./Components/ProtectedRoute"; // Fixed import

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/api/auth/google/callback" element={<CallbackComponent />} />

          {/* Protected Routes */}
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderBoard />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
