import React, { useEffect } from "react";
import { Card, CardHeader, Avatar, Divider, Button } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { red } from "@mui/material/colors";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useDispatch, useSelector } from "react-redux";
import {
  createCommentAction,
  likePostAction,
  savePostAction,
} from "../../redux/Post/post.action";
import { isLikedByReqUser } from "../../utils/isLikedByReqUser";
import { normalizeUsername, getProfileUrl } from "../../utils/stringUtils";

const PostCard = ({ item }) => {
  const [showComments, setShowComments] = React.useState(false);
  const [commentInput, setCommentInput] = React.useState("");
  const { post, auth } = useSelector((store) => store);
  const [isLocalSaved, setIsLocalSaved] = React.useState(false);
  const dispatch = useDispatch();

  // Check if this post is saved by the user
  const isSaved = React.useMemo(() => {
    if (!auth.user || !auth.user.savedPostIds) return false;
    return auth.user.savedPostIds.includes(item.id);
  }, [auth.user, item.id]);

  const normalizeUsername = (firstName, lastName) => {
    // Function to remove diacritics (accents)
    const removeDiacritics = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Get normalized first and last names
    const normalizedFirstName = firstName
      ? removeDiacritics(firstName.toLowerCase())
      : "";
    const normalizedLastName = lastName
      ? removeDiacritics(lastName.toLowerCase())
      : "";

    // Create username
    let username = normalizedFirstName;
    if (normalizedLastName) {
      username += "_" + normalizedLastName;
    }

    return username;
  };

  useEffect(() => {
    console.log("Auth user:", auth.user);
    console.log("Is this post saved:", isSaved);
    console.log("Item ID:", item.id);
    if (auth.user?.savedPostIds) {
      console.log("Saved post IDs:", auth.user.savedPostIds);
    }
  }, [auth.user, isSaved, item.id]);

  useEffect(() => {
    if (auth.user?.savedPostIds) {
      setIsLocalSaved(auth.user.savedPostIds.includes(item.id));
    }
  }, [auth.user?.savedPostIds, item.id]);

  if (!item || !item.user) {
    return (
      <Card className="p-5">
        <Typography>Post data unavailable</Typography>
      </Card>
    );
  }

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  const handleCreateComment = (content) => {
    if (!content.trim() || !auth.user) return;

    const reqData = {
      postId: item.id,
      data: { content: content },
    };
    dispatch(createCommentAction(reqData));
    setCommentInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateComment(commentInput);
    }
  };

  const handleLikePost = () => {
    if (!auth.user) return;

    console.log("Liking post:", item.id);
    console.log("Current user:", auth.user);
    console.log("JWT token available:", !!localStorage.getItem("jwt"));

    dispatch(likePostAction(item.id));
  };

  const handleSavePost = () => {
    if (!auth.user) return;
    setIsLocalSaved(!isLocalSaved);
    dispatch(savePostAction(item.id));
  };

  const renderVideoContent = () => {
    if (!item.video) return null;

    return (
      <div
        className="video-container"
        style={{
          width: "100%",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          aspectRatio: "16/9",
          overflow: "hidden",
        }}
      >
        <video
          controls
          poster={item.image || ""}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        >
          <source src={item.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  return (
    <Card className="">
      <CardHeader
        avatar={
          <Avatar
            src={item.user.avatar}
            sx={{
              bgcolor: item.user.avatar ? "transparent" : red[500],
              width: 40,
              height: 40,
            }}
            aria-label="user avatar"
          >
            {item.user.firstName?.[0] || "U"}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`${item.user.firstName || ""} ${item.user.lastName || ""}`}
        subheader={
          "@" + normalizeUsername(item.user.firstName, item.user.lastName)
        }
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {item.caption || "No caption"}
        </Typography>
      </CardContent>
      {/* Display image if present and no video */}
      {item.image && !item.video && (
        <CardMedia
          component="img"
          height="194"
          image={item.image}
          alt="Post image"
        />
      )}

      {/* Display video if present using the specialized function */}
      {item.video && renderVideoContent()}

      {/* <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {item.caption || "No caption"}
        </Typography>
      </CardContent> */}

      <CardActions className="flex justify-between" disableSpacing>
        <div>
          <IconButton onClick={handleLikePost}>
            {auth.user && isLikedByReqUser(auth.user.id, item) ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>

          <IconButton>
            <ShareIcon />
          </IconButton>

          <IconButton onClick={handleShowComments}>
            <ChatBubbleIcon />
          </IconButton>
        </div>

        <div>
          <IconButton onClick={handleSavePost}>
            {isLocalSaved ? (
              <BookmarkIcon style={{ color: "#FFD700" }} />
            ) : (
              <BookmarkBorderIcon />
            )}
          </IconButton>
        </div>
      </CardActions>

      {showComments && (
        <section>
          <div className="flex items-center space-x-5 mx-3 my-5">
            <Avatar
              src={auth.user?.avatar}
              sx={{
                bgcolor: auth.user?.avatar ? "transparent" : "primary.main",
                width: 32,
                height: 32,
              }}
            >
              {auth.user?.firstName?.[0] || "U"}
            </Avatar>
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full outline-none bg-transparent border border-[#3b4054] rounded-full px-5 py-2"
              type="text"
              placeholder="Write your comment..."
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => handleCreateComment(commentInput)}
              disabled={!commentInput.trim()}
            >
              Post
            </Button>
          </div>
          <Divider />

          {/* Comments section */}
          <div className="mx-3 space-y-2 my-5">
            {item.comments && item.comments.length > 0 ? (
              item.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex justify-between items-start mb-3"
                >
                  <div className="flex items-start space-x-3 w-full">
                    <Avatar
                      src={comment.user?.avatar}
                      sx={{
                        height: "2rem",
                        width: "2rem",
                        fontSize: ".8rem",
                        bgcolor: comment.user?.avatar
                          ? "transparent"
                          : "primary.main",
                      }}
                    >
                      {comment.user?.firstName?.[0] || "U"}
                    </Avatar>
                    <div className="w-full overflow-hidden">
                      <p className="font-semibold text-sm whitespace-normal break-words">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </p>
                      <p className="text-sm mt-1 whitespace-normal break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center py-2">
                <Typography variant="body2">No comments yet</Typography>
              </div>
            )}
          </div>
        </section>
      )}
    </Card>
  );
};

export default PostCard;
