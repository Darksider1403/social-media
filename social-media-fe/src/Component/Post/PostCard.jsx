import * as React from "react";
import { Card, CardHeader, Avatar, Divider } from "@mui/material";
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
} from "../../redux/Post/post.action";
import { isLikedByReqUser } from "../../utils/isLikedByReqUser";

const PostCard = ({ item }) => {
  const [showComments, setShowComments] = React.useState(false);
  const [commentInput, setCommentInput] = React.useState("");
  const { post, auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  // Safety check for the item
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
    if (!content.trim()) return;

    const reqData = {
      postId: item.id,
      data: { content: content },
    };
    dispatch(createCommentAction(reqData));
    setCommentInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateComment(e.target.value);
      e.target.value = "";
    }
  };

  const handleLikePost = () => {
    dispatch(likePostAction(item.id));
  };

  // Extracted video rendering to make it more focused and debuggable
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
          aspectRatio: "16/9", // Maintain a 16:9 aspect ratio container
          overflow: "hidden",
        }}
      >
        <video
          controls
          poster={item.image || ""}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain", // This ensures the video maintains its aspect ratio
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
          "@" +
          (item.user.firstName?.toLowerCase() || "") +
          "_" +
          (item.user.lastName?.toLowerCase() || "")
        }
      />

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

      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {item.caption || "No caption"}
        </Typography>
      </CardContent>

      <CardActions className="flex justify-between" disableSpacing>
        <div>
          <IconButton onClick={handleLikePost}>
            {isLikedByReqUser(auth.user.id, item) ? (
              <FavoriteIcon />
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
          <IconButton>
            {item.saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
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
          </div>
          <Divider />

          {/* Comments section */}
          <div className="mx-3 space-y-2 my-5 text-xs">
            {item.comments && item.comments.length > 0 ? (
              item.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-5">
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
                    <div>
                      <p className="font-semibold">
                        {comment.user?.firstName || "User"}
                      </p>
                      <p>{comment.content}</p>
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
