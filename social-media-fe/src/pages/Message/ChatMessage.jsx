import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ChatMessage = ({ item }) => {
  const { auth } = useSelector((store) => store);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Improved user identification logic
  const isCurrentUserMessage = () => {
    // If item doesn't have a valid user object, return false
    if (!item || !item.user) return false;

    // Check user ID first (most reliable)
    if (item.user.id && auth.user?.id) {
      return item.user.id === auth.user.id;
    }

    // Fallback to email if IDs aren't available
    if (item.user.email && auth.user?.email) {
      return item.user.email === auth.user.email;
    }

    // Last resort - use username/firstName
    if (item.user.firstName && auth.user?.firstName) {
      return item.user.firstName === auth.user.firstName;
    }

    return false;
  };

  // Format timestamp to show as time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "";
    }
  };

  // Check if message is from current user
  const isCurrentUser = isCurrentUserMessage();

  // Open image zoom
  const handleOpenImageZoom = () => {
    setShowImageZoom(true);
  };

  // Close image zoom
  const handleCloseImageZoom = () => {
    setZoomScale(1);
    setShowImageZoom(false);
  };

  // Toggle zoom level
  const toggleZoom = () => {
    setZoomScale(zoomScale === 1 ? 1.5 : 1);
  };

  return (
    <>
      <div
        className={`flex ${
          isCurrentUser ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`flex flex-col ${
            isCurrentUser ? "items-end" : "items-start"
          }`}
          style={{ maxWidth: "70%" }}
        >
          <div
            className={`p-2 ${
              item.image ? "rounded-md" : "px-4 py-2 rounded-2xl"
            } ${
              isCurrentUser
                ? "bg-blue-500 text-white"
                : "bg-[#191c29] text-white"
            }`}
          >
            {item.image && (
              <img
                alt="message"
                className="w-[12rem] h-[17rem] object-cover rounded-md cursor-pointer"
                src={item.image}
                onClick={handleOpenImageZoom}
              />
            )}
            {item.content && (
              <p className={`${item.image ? "py-2" : ""} break-words`}>
                {item.content}
              </p>
            )}
          </div>

          {/* Message timestamp */}
          <span className="text-xs text-gray-500 mt-1">
            {formatMessageTime(item.timestamp)}
          </span>
        </div>
      </div>

      {/* Image zoom dialog - Implemented inline to avoid import issues */}
      {item.image && (
        <Dialog
          open={showImageZoom}
          onClose={handleCloseImageZoom}
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
            onClick={handleCloseImageZoom}
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
            src={item.image}
            alt="Chat image"
            onClick={toggleZoom}
            style={{
              maxHeight: "90vh",
              maxWidth: "90vw",
              objectFit: "contain",
              transition: "transform 0.3s ease",
              transform: `scale(${zoomScale})`,
              cursor: "zoom-in",
            }}
          />
        </Dialog>
      )}
    </>
  );
};

export default ChatMessage;
