import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SimpleImageZoom = ({ src, alt = "Chat image", open, onClose }) => {
  const [scale, setScale] = useState(1);

  // Toggle between normal and zoomed view
  const toggleZoom = () => {
    setScale(scale === 1 ? 1.5 : 1);
  };

  // Reset zoom when dialog closes
  const handleClose = () => {
    setScale(1);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          boxShadow: "none",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.6)" },
        }}
      >
        <CloseIcon />
      </IconButton>

      <img
        src={src}
        alt={alt}
        onClick={toggleZoom}
        style={{
          maxHeight: "90vh",
          maxWidth: "90vw",
          objectFit: "contain",
          transition: "transform 0.3s ease",
          transform: `scale(${scale})`,
          cursor: "zoom-in",
        }}
      />
    </Dialog>
  );
};

export default SimpleImageZoom;
