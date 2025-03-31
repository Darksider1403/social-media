import React, { useState, useRef } from "react";
import {
  Button,
  TextField,
  Card,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useDispatch, useSelector } from "react-redux";
import { createStoryAction } from "../../redux/Story/story.action";
import { useNavigate } from "react-router-dom";

const CreateStories = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the loading state from Redux store
  const { loading } = useSelector((state) => state.story);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      // Based on your backend, it seems it only supports images for now
      alert("Please select an image file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Convert the image to a base64 string for sending to the API
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64String = reader.result;

        // Create story object according to your backend model
        const storyData = {
          captions: caption,
          image: base64String.split(",")[1], // Remove the data:image/jpeg;base64, part
        };

        // Dispatch action to create story
        await dispatch(createStoryAction(storyData));

        // Redirect to stories page after successful upload
        navigate("/stories");
      };
    } catch (error) {
      console.error("Error uploading story:", error);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setCaption("");
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Story</h1>
          {preview && (
            <IconButton onClick={handleClear} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </div>

        <div className="space-y-6">
          {/* Image Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer relative"
            onClick={triggerImageUpload}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            {preview ? (
              <img
                src={preview}
                alt="Story preview"
                className="w-full max-h-[400px] object-contain mb-4"
              />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <IconButton color="primary">
                    <ImageIcon sx={{ fontSize: 36 }} />
                  </IconButton>
                </div>
                <p>Click to upload image or drag and drop</p>
                <p className="text-sm text-gray-500">
                  JPG, PNG, GIF (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Caption Input */}
          <TextField
            fullWidth
            label="Caption"
            variant="outlined"
            placeholder="Add a caption to your story"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            multiline
            rows={2}
          />

          {/* Upload Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            startIcon={
              loading ? <CircularProgress size={24} /> : <CloudUploadIcon />
            }
          >
            {loading ? "Uploading..." : "Post to Story"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateStories;
