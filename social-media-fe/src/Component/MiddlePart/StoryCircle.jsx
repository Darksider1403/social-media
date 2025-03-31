import React from "react";
import { Avatar } from "@mui/material";

const StoryCircle = ({ story, onClick }) => {
  // Format image URL function
  const formatImageUrl = (image) => {
    if (!image) return null;

    // Check if it's already a URL
    if (image.startsWith("http")) {
      return image;
    }

    // If it's a base64 string without the prefix, add it
    if (!image.startsWith("data:")) {
      return `data:image/jpeg;base64,${image}`;
    }

    return image;
  };

  // Get the first story's image as the preview (if available)
  const previewImage =
    story.stories && story.stories.length > 0
      ? formatImageUrl(story.stories[0].image)
      : null;

  return (
    <div
      className="flex flex-col items-center mx-2 cursor-pointer"
      onClick={onClick}
    >
      <Avatar
        src={previewImage || formatImageUrl(story.profileImage)}
        sx={{
          width: "5rem",
          height: "5rem",
          border: "3px solid #3b82f6",
        }}
      >
        {!previewImage && !story.profileImage && story.user?.charAt(0)}
      </Avatar>
      <p className="mt-1 text-sm max-w-[5rem] truncate text-center">
        {story.user}
      </p>
    </div>
  );
};

export default StoryCircle;
