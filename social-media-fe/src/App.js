import "./App.css";
import Authentication from "./pages/Authentication/Authentication";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Message from "./pages/Message/Message";
import Profile from "./pages/Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { getProfileAction } from "./redux/Auth/auth.action";
import { connectWebSocket, disconnectWebSocket } from "./config/websocket";
import Notification from "./pages/Notification/Notification";
import CreateStories from "./Component/Story/CrearteStories";
import Stories from "./Component/Story/Stories";
import OAuthRedirectHandler from "./Component/auth/OAuthRedirectHandler";

function App() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Add this useEffect to check for token and restore auth state on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    console.log("Stored token:", storedToken ? "Token exists" : "No token");

    if (storedToken) {
      console.log("Attempting to restore session with token");
      dispatch(getProfileAction(storedToken));
    }
  }, [dispatch]);

  // Connect WebSocket when user is authenticated
  useEffect(() => {
    if (user && token) {
      try {
        console.log("Connecting WebSocket for user:", user.id);
        connectWebSocket(user.id, token, dispatch);
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
      }
    }

    // Cleanup WebSocket on unmount
    return () => {
      try {
        disconnectWebSocket();
      } catch (error) {
        console.error("Error disconnecting WebSocket:", error);
      }
    };
  }, [user, token, dispatch]);

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            !token ? <Authentication /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/register"
          element={
            !token ? <Authentication /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/"
          element={
            !token ? <Authentication /> : <Navigate to="/home" replace />
          }
        />

        {/* OAuth Redirect Route */}
        <Route path="/oauth2/redirect" element={<OAuthRedirectHandler />} />

        {/* Protected routes */}
        <Route
          path="/home/*"
          element={token ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/message"
          element={token ? <Message /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile/:username"
          element={token ? <Profile /> : <Navigate to="/login" replace />}
        />

        <Route path="/home/notifications" element={<Notification />} />
        <Route path="/create-story" element={<CreateStories />} />
        <Route path="/stories" element={<Stories />} />
      </Routes>
    </div>
  );
}

export default App;
