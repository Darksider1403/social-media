import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  IconButton,
  Avatar,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useDispatch, useSelector } from "react-redux";
import { getAllStoriesAction } from "../../redux/Story/story.action";

const Stories = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [groupedStories, setGroupedStories] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get stories data from Redux store
  const { stories, loading } = useSelector((state) => state.story);

  useEffect(() => {
    // Fetch stories from Redux store
    dispatch(getAllStoriesAction());
  }, [dispatch]);

  // Process stories into groups by user
  useEffect(() => {
    if (stories && stories.length > 0) {
      // Group stories by user
      const storyGroups = {};

      stories.forEach((story) => {
        if (!story.user) return; // Skip stories with no user data

        const userId = story.user.id;
        if (!storyGroups[userId]) {
          storyGroups[userId] = {
            userId,
            username:
              `${story.user.firstName || ""} ${
                story.user.lastName || ""
              }`.trim() || "User",
            profileImage: story.user.avatar, // Use avatar instead of image
            stories: [],
          };
        }

        storyGroups[userId].stories.push({
          id: story.id,
          type: "image",
          url: story.image,
          caption: story.captions,
          timestamp: story.timestamp,
        });
      });

      // Convert to array format for easier rendering
      const groupedArray = Object.values(storyGroups);
      setGroupedStories(groupedArray);
    }
  }, [stories]);

  useEffect(() => {
    if (showStory && !paused && groupedStories.length > 0) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = oldProgress + 1;
          if (newProgress >= 100) {
            nextStory();
            return 0;
          }
          return newProgress;
        });
      }, 50); // Adjust timing as needed

      return () => {
        clearInterval(timer);
      };
    }
  }, [showStory, paused, groupedStories]);

  const handleStoryClick = (userIndex) => {
    if (userIndex >= 0 && userIndex < groupedStories.length) {
      setCurrentUserIndex(userIndex);
      setCurrentStoryIndex(0);
      setShowStory(true);
      setProgress(0);
    }
  };

  const closeStory = () => {
    setShowStory(false);
    setProgress(0);
  };

  const nextStory = () => {
    if (groupedStories.length === 0) return;

    const currentUser = groupedStories[currentUserIndex];
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else if (currentUserIndex < groupedStories.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (groupedStories.length === 0) return;

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(
        groupedStories[currentUserIndex - 1].stories.length - 1
      );
      setProgress(0);
    }
  };

  const handleCreateStory = () => {
    navigate("/create-story");
  };

  // Helper function to format image URL or base64
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

  if (loading && groupedStories.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Stories List View */}
      {!showStory && (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Stories</h1>

          <div className="flex space-x-4 overflow-x-auto pb-4">
            {/* Create Story Button */}
            <div className="flex flex-col items-center min-w-[80px]">
              <Button
                onClick={handleCreateStory}
                sx={{
                  minWidth: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  mb: 1,
                }}
                variant="outlined"
              >
                <AddIcon />
              </Button>
              <span className="text-sm">Create</span>
            </div>

            {/* Story Circles */}
            {groupedStories.map((user, index) => (
              <div
                key={user.userId}
                className="flex flex-col items-center min-w-[80px] cursor-pointer"
                onClick={() => handleStoryClick(index)}
              >
                <Avatar
                  src={formatImageUrl(user.profileImage)}
                  sx={{
                    width: 64,
                    height: 64,
                    border: "2px solid #3b82f6",
                    mb: 1,
                  }}
                >
                  {user.username?.charAt(0) || "U"}
                </Avatar>
                <span className="text-sm truncate w-full text-center">
                  {user.username}
                </span>
              </div>
            ))}
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {groupedStories.flatMap((user) =>
              user.stories.map((story) => (
                <Card
                  key={story.id}
                  className="aspect-[9/16] relative overflow-hidden cursor-pointer"
                  onClick={() => {
                    const userIndex = groupedStories.findIndex(
                      (u) => u.userId === user.userId
                    );
                    const storyIndex = user.stories.findIndex(
                      (s) => s.id === story.id
                    );
                    setCurrentUserIndex(userIndex);
                    setCurrentStoryIndex(storyIndex);
                    setShowStory(true);
                  }}
                >
                  <img
                    src={formatImageUrl(story.url)}
                    alt={story.caption}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center space-x-2">
                      <Avatar
                        src={formatImageUrl(user.profileImage)}
                        sx={{ width: 24, height: 24 }}
                      >
                        {user.username?.charAt(0) || "U"}
                      </Avatar>
                      <span className="text-white text-sm">
                        {user.username}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {showStory &&
        groupedStories.length > 0 &&
        currentUserIndex < groupedStories.length && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="relative w-full max-w-md h-full max-h-screen">
              {/* Progress Bars */}
              <div className="absolute top-0 left-0 right-0 z-10 p-2 flex space-x-1">
                {groupedStories[currentUserIndex].stories.map((_, index) => (
                  <LinearProgress
                    key={index}
                    variant="determinate"
                    value={
                      index === currentStoryIndex
                        ? progress
                        : index < currentStoryIndex
                        ? 100
                        : 0
                    }
                    sx={{
                      height: 2,
                      flex: 1,
                      bgcolor: "rgba(255,255,255,0.3)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "white",
                      },
                    }}
                  />
                ))}
              </div>

              {/* User Info */}
              <div className="absolute top-4 left-0 right-0 z-10 px-4 flex items-center">
                <Avatar
                  src={formatImageUrl(
                    groupedStories[currentUserIndex].profileImage
                  )}
                  sx={{ width: 36, height: 36, mr: 2 }}
                >
                  {groupedStories[currentUserIndex].username?.charAt(0) || "U"}
                </Avatar>
                <span className="text-white font-medium">
                  {groupedStories[currentUserIndex].username}
                </span>
                <div className="ml-auto">
                  <IconButton
                    onClick={closeStory}
                    size="small"
                    sx={{ color: "white" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>

              {/* Story Content */}
              <div
                className="h-full w-full"
                onClick={() => nextStory()}
                onMouseDown={() => setPaused(true)}
                onMouseUp={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
              >
                <img
                  src={formatImageUrl(
                    groupedStories[currentUserIndex].stories[currentStoryIndex]
                      .url
                  )}
                  alt="Story"
                  className="object-contain h-full w-full"
                />

                {/* Caption */}
                {groupedStories[currentUserIndex].stories[currentStoryIndex]
                  .caption && (
                  <div className="absolute bottom-8 left-0 right-0 px-4 text-center">
                    <p className="text-white bg-black/30 p-2 rounded-lg">
                      {
                        groupedStories[currentUserIndex].stories[
                          currentStoryIndex
                        ].caption
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <button
                className="absolute left-0 top-0 bottom-0 w-1/4 h-full z-10 flex items-center justify-start opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  prevStory();
                }}
              >
                <NavigateBeforeIcon sx={{ color: "white", fontSize: 40 }} />
              </button>

              <button
                className="absolute right-0 top-0 bottom-0 w-1/4 h-full z-10 flex items-center justify-end opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  nextStory();
                }}
              >
                <NavigateNextIcon sx={{ color: "white", fontSize: 40 }} />
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Stories;
