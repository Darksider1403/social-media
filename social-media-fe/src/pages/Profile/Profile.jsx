import { Avatar, Button, Card } from "@mui/material";
import * as React from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PostCard from "../../Component/Post/PostCard";
import UserReelsCard from "../../Component/Reels/UserReelsCard";
import defaultBackground from "../../assets/image.png"; // Default background image
import Sidebar from "../../Component/Sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { getProfileByUsernameAction } from "../../redux/Auth/auth.action";
import { getUsersPostAction } from "../../redux/Post/post.action";

const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const { post } = useSelector((state) => state);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("post");

  const tabs = [
    { value: "post", name: "Post" },
    { value: "reels", name: "Reels" },
    { value: "saved", name: "Saved" },
    { value: "repost", name: "Repost" },
  ];

  // Format username to remove @ if present
  const formattedUsername = username?.startsWith("@")
    ? username.substring(1)
    : username;

  // Fetch user profile data
  React.useEffect(() => {
    if (formattedUsername) {
      dispatch(getProfileByUsernameAction(formattedUsername));
    }
  }, [formattedUsername, dispatch]);

  // Fetch user posts
  React.useEffect(() => {
    if (auth.user?.id) {
      dispatch(getUsersPostAction(auth.user.id));
    }
  }, [auth.user?.id, dispatch]);

  // Get the user's posts, saved posts, and reels
  const userPosts = post.posts || [];
  // Saved posts should be fetched from the user's saved posts field if available
  const savedPosts = auth.user?.savedPosts || [];
  // Reels would need to be fetched from a dedicated endpoint if you have one

  const handleOpenProfileModal = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => setValue(newValue);

  // Check if this is the current user's profile
  const isOwnProfile =
    auth.user?.id &&
    (formattedUsername === auth.user.username ||
      formattedUsername ===
        `${auth.user.firstName?.toLowerCase()}_${auth.user.lastName?.toLowerCase()}`);

  const profileUser = auth.profileUser || auth.user || {};

  return (
    <Box display="flex" flexDirection="row" width="100%">
      <Box
        sx={{
          width: { xs: "100%", lg: "25%" },
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <Sidebar />
      </Box>

      <Box
        sx={{
          width: { xs: "100%", lg: "75%" },
          display: "flex",
          justifyContent: "center",
          px: 2,
          minHeight: "100vh",
        }}
      >
        <Card className="my-10 w-[70%]">
          <div className="rounded-md">
            <div className="h-[15rem]">
              <img
                className="w-full h-full rounded-t-md object-cover"
                src={profileUser.backgroundImage || defaultBackground}
                alt="Cover"
              />
            </div>

            <div className="px-5 flex justify-between items-start mt-5 h-[5rem]">
              <Avatar
                className="transform -translate-y-24"
                sx={{
                  width: "10rem",
                  height: "10rem",
                  bgcolor: profileUser.avatar ? "transparent" : "primary.main",
                }}
                src={profileUser.avatar}
              >
                {!profileUser.avatar && (profileUser.firstName?.[0] || "U")}
              </Avatar>

              {isOwnProfile ? (
                <Button
                  sx={{ borderRadius: "20px" }}
                  variant="outlined"
                  onClick={handleOpenProfileModal}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button sx={{ borderRadius: "20px" }} variant="outlined">
                  Follow
                </Button>
              )}
            </div>

            <div className="p-5">
              <div>
                <h1 className="py-1 font-bold text-xl">
                  {profileUser.firstName && profileUser.lastName
                    ? `${profileUser.firstName} ${profileUser.lastName}`
                    : "User"}
                </h1>
                <p>
                  @
                  {profileUser.username ||
                    (profileUser.firstName && profileUser.lastName
                      ? `${profileUser.firstName.toLowerCase()}_${profileUser.lastName.toLowerCase()}`
                      : "username")}
                </p>
              </div>

              <div className="flex gap-2 items-center py-3">
                <span>{userPosts.length || 0} posts</span>
                <span>{profileUser.followers?.length || 0} followers</span>
                <span>{profileUser.followings?.length || 0} followings</span>
              </div>

              <div>
                <p>{profileUser.bio || "No bio available"}</p>
              </div>
            </div>

            <section>
              <Box
                sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="profile tabs"
                >
                  {tabs.map((item) => (
                    <Tab
                      key={item.value}
                      value={item.value}
                      label={item.name}
                    />
                  ))}
                </Tabs>
              </Box>

              <div className="flex flex-col items-center w-full">
                {value === "post" && (
                  <div className="space-y-5 w-[70%] my-10">
                    {userPosts.length > 0 ? (
                      userPosts.map((post) => (
                        <div
                          key={post.id}
                          className="border border-slate-100 rounded-md"
                        >
                          <PostCard item={post} />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-5">
                        <p>No posts available</p>
                      </div>
                    )}
                  </div>
                )}

                {value === "reels" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 p-4">
                    {/* If you have a dedicated reels field or API */}
                    {userPosts.filter((post) => post.video).length > 0 ? (
                      userPosts
                        .filter((post) => post.video)
                        .map((reel, index) => (
                          <UserReelsCard
                            key={reel.id}
                            views={reel.views || 0}
                            title={reel.caption || "Reel"}
                            videoUrl={reel.video}
                            isPinned={index === 0}
                          />
                        ))
                    ) : (
                      <div className="col-span-full text-center py-5">
                        <p>No reels available</p>
                      </div>
                    )}
                  </div>
                )}

                {value === "saved" && (
                  <div className="space-y-5 w-[70%] my-10">
                    {savedPosts.length > 0 ? (
                      savedPosts.map((post) => (
                        <div
                          key={post.id}
                          className="border border-slate-100 rounded-md"
                        >
                          <PostCard item={post} />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-5">
                        <p>No saved posts</p>
                      </div>
                    )}
                  </div>
                )}

                {value === "repost" && (
                  <div className="space-y-5 w-[70%] my-10">
                    {/* If you have repost functionality */}
                    <div className="text-center py-5">
                      <p>No reposts available</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <ProfileModal open={open} handleClose={handleClose} />
        </Card>
      </Box>
    </Box>
  );
};

export default Profile;
