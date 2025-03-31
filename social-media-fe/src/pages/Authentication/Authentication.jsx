// Authentication.jsx
import React from "react";
import Login from "./Login";
import Register from "./Register";
import { Card } from "@mui/material";
import { useLocation } from "react-router-dom";

const Authentication = () => {
  const location = useLocation();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Side Image */}
      <div style={{ flex: 7, overflow: "hidden" }}>
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          src="https://cdn.pixabay.com/photo/2018/11/29/21/51/social-media-3846597_1280.png"
          alt="Social Media Background"
        />
      </div>

      {/* Right Side Content */}
      <div
        style={{
          flex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 2rem",
          height: "100vh",
        }}
      >
        <Card className="card p-8">
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <h1 style={{ fontSize: "2rem", margin: "0" }}>
                Darksider Social
              </h1>
              <p
                style={{
                  fontSize: "0.875rem",
                  maxWidth: "80%",
                  margin: "0 auto",
                }}
              >
                Connecting Lives, Sharing Stories: Your Social World, Your Way
              </p>
            </div>

            {location.pathname === "/login" || location.pathname === "/" ? (
              <Login />
            ) : (
              <Register />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Authentication;
