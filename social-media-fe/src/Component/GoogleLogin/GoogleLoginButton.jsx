import React from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorize/google";
  };

  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={handleGoogleLogin}
      fullWidth
      sx={{
        textTransform: "none",
        my: 1,
        py: 1,
        borderColor: "#4285F4",
        color: "#4285F4",
        "&:hover": {
          borderColor: "#4285F4",
          backgroundColor: "rgba(66, 133, 244, 0.04)",
        },
      }}
    >
      Sign in with Google
    </Button>
  );
}

export default GoogleLoginButton;
