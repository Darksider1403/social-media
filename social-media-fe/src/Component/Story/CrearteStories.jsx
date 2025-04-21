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
import { useDispatch, useSelector } from "react-redux";
import { createStoryAction } from "../../redux/Story/story.action";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary"; // Import your uploadToCloudinary function

const CreateStories = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
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
      alert("Please select an image file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);

      // Upload to Cloudinary and get URL
      const imageUrl = await uploadToCloudinary(selectedFile, "image");

      if (!imageUrl) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      // Create story object with Cloudinary URL
      const storyData = {
        captions: caption,
        image: imageUrl, // Use the Cloudinary URL instead of base64
      };

      // Dispatch action to create story
      await dispatch(createStoryAction(storyData));

      // Redirect to stories page after successful upload
      navigate("/stories");
    } catch (error) {
      console.error("Error uploading story:", error);
      alert("Failed to upload story. Please try again.");
    } finally {
      setUploading(false);
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

  // Determine if the button should be disabled
  const isButtonDisabled = !selectedFile || loading || uploading;

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
            disabled={isButtonDisabled}
            startIcon={
              loading || uploading ? (
                <CircularProgress size={24} />
              ) : (
                <CloudUploadIcon />
              )
            }
          >
            {loading || uploading ? "Uploading..." : "Post to Story"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateStories;
