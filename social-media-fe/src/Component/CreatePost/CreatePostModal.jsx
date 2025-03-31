import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import { Avatar, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { useDispatch, useSelector } from "react-redux";
import {
  createCommentAction,
  createPostAction,
} from "../../redux/Post/post.action";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: ".6rem",
  outline: "none",
};

const CreatePostModal = ({ handleClose, open }) => {
  const [selectedImage, setSelectedImage] = React.useState();
  const [selectedVideo, setSelectedVideo] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  // Get current user data from Redux store
  const auth = useSelector((store) => store.auth);
  const currentUser = auth?.user || {};

  // Get user details with fallbacks
  const userFirstName = currentUser.firstName || "User";
  const userLastName = currentUser.lastName || "";
  const userAvatar = currentUser.avatar || "";
  const userHandle = currentUser.firstName
    ? `@${currentUser.firstName.toLowerCase()}${
        currentUser.lastName ? `_${currentUser.lastName.toLowerCase()}` : ""
      }`
    : "@user";

  const handleSelectImage = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setIsLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(event.target.files[0], "image");
      setSelectedImage(imageUrl);
      formik.setFieldValue("image", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVideo = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setIsLoading(true);
    try {
      const videoUrl = await uploadToCloudinary(event.target.files[0], "video");
      setSelectedVideo(videoUrl);
      formik.setFieldValue("video", videoUrl);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      caption: "",
      image: "",
      video: "",
    },
    onSubmit: (values) => {
      console.log("formik values", values);
      dispatch(createPostAction(values));

      // Reset the form and selected media
      formik.resetForm();
      setSelectedImage(null);
      setSelectedVideo(null);

      handleClose(); // Close modal after submission
    },
  });

  const handleModalClose = () => {
    // Reset form and selected media when modal is closed
    formik.resetForm();
    setSelectedImage(null);
    setSelectedVideo(null);
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <div className="flex space-x-4 items-center">
                <Avatar
                  src={userAvatar}
                  sx={{
                    bgcolor: userAvatar ? "transparent" : "primary.main",
                    width: 40,
                    height: 40,
                  }}
                >
                  {userFirstName.charAt(0)}
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{`${userFirstName} ${userLastName}`}</p>
                  <p className="text-sm">{userHandle}</p>
                </div>
              </div>

              <textarea
                className="outline-none w-full mt-5 p-2 bg-transparent border border-[#3b4054] rounded-sm"
                placeholder="What's on your mind"
                name="caption"
                id=""
                onChange={formik.handleChange}
                value={formik.values.caption}
                rows={4}
              ></textarea>

              <div className="flex space-x-5 items-center mt-5">
                <div>
                  <input
                    type="file"
                    name="image"
                    id="image-input"
                    accept="image/*"
                    onChange={handleSelectImage}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="image-input">
                    <IconButton color="primary" component="span">
                      <ImageIcon />
                    </IconButton>
                  </label>
                  <span>Image</span>
                </div>

                <div>
                  <input
                    type="file"
                    name="video"
                    id="video-input"
                    accept="video/*"
                    onChange={handleSelectVideo}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="video-input">
                    <IconButton color="primary" component="span">
                      <VideoCallIcon />
                    </IconButton>
                  </label>
                  <span>Video</span>
                </div>
              </div>

              {selectedImage && (
                <div className="mt-4">
                  <img
                    className="h-[10rem] rounded-md"
                    src={selectedImage}
                    alt=""
                  />
                </div>
              )}

              {selectedVideo && (
                <div className="mt-4">
                  <video
                    className="h-[10rem] w-auto rounded-md"
                    src={selectedVideo}
                    controls
                  />
                </div>
              )}

              <div className="flex w-full justify-end mt-4">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ borderRadius: "1.5rem" }}
                  disabled={isLoading}
                >
                  Post
                </Button>
              </div>
            </div>
          </form>

          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      </Modal>
    </div>
  );
};

export default CreatePostModal;
