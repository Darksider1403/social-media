import React, { useState, useRef } from "react";
import {
  Button,
  TextField,
  Card,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import { createReelAction } from "../../redux/Reels/reels.action";
import { useNavigate } from "react-router-dom";

const CreateReelsForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from Redux
  const { createLoading, createError } = useSelector((state) => state.reels);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setNotification({
        open: true,
        message: "Please provide both a title and a video file",
        severity: "error",
      });
      return;
    }

    try {
      // Create reel data object with the actual file for Cloudinary upload
      const reelData = {
        title: title,
        description: description,
        video: selectedFile, // Send the actual file, not just the name
      };

      // Dispatch create reel action
      await dispatch(createReelAction(reelData));

      // Show success notification
      setNotification({
        open: true,
        message: "Reel uploaded successfully!",
        severity: "success",
      });

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setTitle("");
      setDescription("");

      // Navigate back to reels page
      setTimeout(() => {
        navigate("/reels");
      }, 2000);
    } catch (error) {
      setNotification({
        open: true,
        message: createError || "Failed to upload reel. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Reel</h1>

        <div className="space-y-6">
          {/* Video Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="video/*"
              className="hidden"
            />

            {preview ? (
              <video
                src={preview}
                className="w-full max-h-[400px] object-contain mb-4"
                controls
              />
            ) : (
              <div className="space-y-4">
                <CloudUploadIcon sx={{ fontSize: 48 }} color="primary" />
                <p>Click to upload a video or drag and drop</p>
                <p className="text-sm text-gray-500">
                  MP4, WebM, or Ogg (Max 100MB)
                </p>
              </div>
            )}
          </div>

          {/* Title Input */}
          <TextField
            fullWidth
            label="Reel Title"
            variant="outlined"
            placeholder="Enter a title for your reel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Description Input */}
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            placeholder="Add a description to your reel"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Upload Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleUpload}
            disabled={!selectedFile || createLoading}
            startIcon={
              createLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {createLoading ? "Uploading..." : "Upload Reel"}
          </Button>
        </div>
      </Card>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateReelsForm;
