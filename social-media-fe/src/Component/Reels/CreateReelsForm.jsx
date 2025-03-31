import React, { useState, useRef } from "react";
import { Button, TextField, Card } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CreateReelsForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    // Implement your upload logic here
    console.log("Uploading file:", selectedFile);
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
          />

          {/* Description Input */}
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            placeholder="Add a description to your reel"
          />

          {/* Upload Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload Reel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateReelsForm;
