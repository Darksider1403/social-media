import React, { useEffect, useState } from "react";
import { Avatar, Card, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostAction } from "../../redux/Post/post.action";
import {
  getAllStoriesAction,
  getUserStoriesAction,
} from "../../redux/Story/story.action";
import PostCard from "../Post/PostCard";
import CreatePostModal from "../CreatePost/CreatePostModal";
import { useNavigate } from "react-router-dom";

// Set to true when ready to enable stories
const ENABLE_STORIES = true;

const MiddlePart = () => {
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const post = useSelector((state) => state.post);
  const auth = useSelector((state) => state.auth);
  const story = useSelector((state) => state.story);

  const currentUser = auth?.user || {};
  const avatarUrl = currentUser?.avatar || "";
  const nameInitial = currentUser?.firstName
    ? currentUser.firstName.charAt(0).toUpperCase()
    : "U";

  // Fetch posts and stories
  useEffect(() => {
    dispatch(getAllPostAction());

    if (ENABLE_STORIES) {
      dispatch(getAllStoriesAction());
      if (currentUser.id) {
        dispatch(getUserStoriesAction(currentUser.id));
      }
    }
  }, [dispatch, currentUser.id]);

  const handleOpenCreatePostModal = () => {
    setOpenCreatePostModal(true);
  };

  const handleClose = () => {
    setOpenCreatePostModal(false);
  };

  const handleCreateStory = () => {
    navigate("/create-story");
  };

  const handleStoryClick = (userId, storyId) => {
    // Navigate to the Stories component with the selected story
    navigate("/stories");
    // You could also pass state or URL parameters to open specific story
  };

  // Format image URL helper
  const formatImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    if (!image.startsWith("data:")) return `data:image/jpeg;base64,${image}`;
    return image;
  };

  // Get stories to display in the story carousel
  const getStoriesForDisplay = () => {
    if (!story || !story.userStories) return [];

    // Convert the userStories object to an array of user story groups
    return Object.values(story.userStories)
      .filter((stories) => stories && stories.length > 0)
      .map((stories) => {
        const user = stories[0].user;
        return {
          userId: user?.id,
          username: user ? `${user.firstName} ${user.lastName}` : "User",
          profileImage: user?.avatar,
          previewImage: stories[0].image,
        };
      });
  };

  const storiesToDisplay = getStoriesForDisplay();

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl px-4">
        {/* Only render story section if enabled */}
        {ENABLE_STORIES && (
          <section className="flex items-center p-5 rounded-b-md overflow-x-auto">
            {/* Create Story Button */}
            <div
              className="flex flex-col items-center mr-4 cursor-pointer"
              onClick={handleCreateStory}
            >
              <Avatar sx={{ width: "5rem", height: "5rem" }}>
                <AddIcon sx={{ fontSize: "3rem" }} />
              </Avatar>
              <p>Create</p>
            </div>

            {/* Story Circles */}
            {storiesToDisplay.map((story) => (
              <div
                key={story.userId}
                className="flex flex-col items-center mr-4 cursor-pointer"
                onClick={() => handleStoryClick(story.userId)}
              >
                <Avatar
                  src={
                    formatImageUrl(story.previewImage) ||
                    formatImageUrl(story.profileImage)
                  }
                  sx={{
                    width: "5rem",
                    height: "5rem",
                    border: "3px solid #3b82f6",
                  }}
                >
                  {!story.profileImage && story.username?.charAt(0)}
                </Avatar>
                <p className="mt-1 text-sm max-w-[5rem] truncate text-center">
                  {story.username}
                </p>
              </div>
            ))}

            {/* Show placeholder if no stories */}
            {storiesToDisplay.length === 0 && (
              <div className="flex items-center justify-center ml-4">
                <Typography variant="body2" color="textSecondary">
                  No stories available
                </Typography>
              </div>
            )}
          </section>
        )}

        <Card className="p-5 mt-5">
          <div className="flex justify-between">
            {/* Use the current user's avatar */}
            <Avatar
              src={avatarUrl}
              sx={{ bgcolor: avatarUrl ? "transparent" : "primary.main" }}
            >
              {!avatarUrl && nameInitial}
            </Avatar>
            <input
              onClick={handleOpenCreatePostModal}
              readOnly
              type="text"
              className="outline-none w-[90%] rounded-full px-5 bg-transparent border-[#3b4054] border"
              placeholder={`What's on your mind, ${
                currentUser?.firstName || "there"
              }?`}
              aria-label="Create post"
            />
          </div>

          <div className="flex justify-center space-x-9 mt-5">
            <div className="flex items-center">
              <IconButton color="primary" onClick={handleOpenCreatePostModal}>
                <ImageIcon />
              </IconButton>
              <span>Media</span>
            </div>

            <div className="flex items-center">
              <IconButton color="primary" onClick={handleOpenCreatePostModal}>
                <VideocamIcon />
              </IconButton>
              <span>Video</span>
            </div>

            <div className="flex items-center">
              <IconButton color="primary" onClick={handleOpenCreatePostModal}>
                <ArticleIcon />
              </IconButton>
              <span>Write Article</span>
            </div>
          </div>
        </Card>

        <div className="mt-5 space-y-5">
          {post?.posts && post.posts.length > 0 ? (
            post.posts.map((item) => <PostCard key={item.id} item={item} />)
          ) : (
            <Card className="p-5">
              <Typography>No posts available</Typography>
            </Card>
          )}
        </div>

        <CreatePostModal handleClose={handleClose} open={openCreatePostModal} />
      </div>
    </div>
  );
};

export default MiddlePart;
