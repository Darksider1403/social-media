import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CircularProgress, Box, Typography, Alert } from "@mui/material";
import { loginSuccess } from "../../redux/Auth/auth.action";

const OAuthRedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      setError("Authentication failed. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (token) {
      try {
        // Store token in localStorage
        localStorage.setItem("jwt", token);

        // Dispatch login success action
        dispatch(loginSuccess(token));

        // Navigate to home page
        navigate("/home");
      } catch (err) {
        console.error("OAuth login error:", err);
        setError("Failed to process login. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    } else {
      setError("No authentication token received. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [location, dispatch, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        p: 2,
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Completing your sign in...
          </Typography>
        </>
      )}
    </Box>
  );
};

export default OAuthRedirectHandler;
