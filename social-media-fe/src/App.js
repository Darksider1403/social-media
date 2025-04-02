import "./App.css";
import Authentication from "./pages/Authentication/Authentication";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Message from "./pages/Message/Message";
import Profile from "./pages/Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { getProfileAction } from "./redux/Auth/auth.action";

function App() {
  const { token } = useSelector((state) => state.auth);
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
      </Routes>
    </div>
  );
}

export default App;
