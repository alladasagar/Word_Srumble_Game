
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext"; 
import './index.css';

const GOOGLE_CLIENT_ID = "78167013524-4t0csp08n8aaehgcpc69j2l2srssstkk.apps.googleusercontent.com"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider> 
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
