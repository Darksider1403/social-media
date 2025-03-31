import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Avatar, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileAction } from "../../redux/Auth/auth.action";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  outline: "none",
  overFlow: "scroll-y",
  borderRadius: 3,
};

export default function ProfileModal({ open, handleClose }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(auth.user?.avatar || null);

  const handleAvatarChange = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;

    try {
      setIsLoading(true);
      const file = event.target.files[0];
      const avatarUrl = await uploadToCloudinary(file, "image");
      setAvatar(avatarUrl);

      // Update the form value
      formik.setFieldValue("avatar", avatarUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: auth.user?.firstName || "",
      lastName: auth.user?.lastName || "",
      avatar: auth.user?.avatar || "",
      // Add other fields you want to update
    },
    onSubmit: (values) => {
      dispatch(updateProfileAction(values));
      handleClose();
    },
  });

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
                <p>Edit Profile</p>
              </div>
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
            </div>
            <div>
              <div className="h-[15rem]">
                <img
                  className="w-full h-full rounded-t-md object-cover"
                  src={
                    auth.user?.backgroundImage ||
                    "https://cdn.pixabay.com/photo/2014/01/13/20/01/pebbles-243910_640.jpg"
                  }
                  alt="Cover"
                />
              </div>
              <div className="pl-5 relative">
                <Avatar
                  className="transform -translate-y-24"
                  sx={{ width: "10rem", height: "10rem" }}
                  src={avatar || auth.user?.avatar || ""}
                />

                {/* Avatar upload button */}
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    className="absolute transform -translate-y-32 translate-x-16"
                    sx={{
                      bgcolor: "white",
                      "&:hover": { bgcolor: "whitesmoke" },
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                value={formik.values.firstName}
                onChange={formik.handleChange}
              />
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
