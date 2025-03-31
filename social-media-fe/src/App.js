import "./App.css";
import Authentication from "./pages/Authentication/Authentication";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Message from "./pages/Message/Message";
import Profile from "./pages/Profile/Profile";
import { useSelector } from "react-redux";
import React from "react";

function App() {
  const { token } = useSelector((state) => state.auth);

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
          path="/profile/:id"
          element={token ? <Profile /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
