import React, { useEffect, useState } from "react";
import { Avatar, Card, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostAction } from "../../redux/Post/post.action";
import PostCard from "../Post/PostCard";
import CreatePostModal from "../CreatePost/CreatePostModal";

// Set to true when ready to enable stories
const ENABLE_STORIES = false;

const MiddlePart = () => {
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const dispatch = useDispatch();

  const post = useSelector((state) => state.post);
  const auth = useSelector((state) => state.auth);

  const currentUser = auth?.user || {};

  const avatarUrl = currentUser?.avatar || "";

  const nameInitial = currentUser?.firstName
    ? currentUser.firstName.charAt(0).toUpperCase()
    : "U";

  useEffect(() => {
    console.log(`[${new Date().toISOString()}] MiddlePart rendered`);
  }, []);

  useEffect(() => {
    console.log("Fetching posts...");
    dispatch(getAllPostAction());
  }, []);

  const handleOpenCreatePostModal = () => {
    setOpenCreatePostModal(true);
  };

  const handleClose = () => {
    setOpenCreatePostModal(false);
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl px-4">
        {/* Only render story section if enabled */}
        {ENABLE_STORIES && (
          <section className="flex items-center p-5 rounded-b-md overflow-x-auto">
            <div className="flex flex-col items-center mr-4 cursor-pointer">
              <Avatar sx={{ width: "5rem", height: "5rem" }}>
                <AddIcon sx={{ fontSize: "3rem" }} />
              </Avatar>
              <p>New</p>
            </div>

            {/* Placeholder for stories */}
            <div className="flex flex-col items-center mr-4">
              <Avatar sx={{ width: "5rem", height: "5rem" }}>
                <span>1</span>
              </Avatar>
              <p>Story 1</p>
            </div>
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
