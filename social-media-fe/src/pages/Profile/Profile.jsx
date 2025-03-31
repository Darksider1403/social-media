import { Avatar, Button, Card } from "@mui/material";
import * as React from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PostCard from "../../Component/Post/PostCard";
import UserReelsCard from "../../Component/Reels/UserReelsCard";
import logo from "../../assets/avatar_favorite.jpg";
import imageFile from "../../assets/image.png";
import Sidebar from "../../Component/Sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { getProfileAction } from "../../redux/Auth/auth.action";

const Profile = () => {
  const { id } = useParams();
  const { auth } = useSelector((state) => state);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("post");
  const dispatch = useDispatch();
  const tabs = [
    { value: "post", name: "Post" },
    { value: "reels", name: "Reels" },
    { value: "saved", name: "Saved" },
    { value: "repost", name: "Repost" },
  ];

  const posts = [1, 1, 1, 1];
  const reels = [1, 1, 1, 1];
  const saved = [1, 1, 1, 1];
  const repost = [1, 1, 1, 1];

  const handleOpenProfileModal = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Optionally refresh user data after modal closes
    if (auth.token) {
      dispatch(getProfileAction(auth.token));
    }
  };

  const handleChange = (event, newValue) => setValue(newValue);

  const isOwnProfile = auth.user?.id === Number(id);

  React.useEffect(() => {
    // This will re-render the component when auth.user changes
  }, [auth.user]);

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
                src={auth.user?.backgroundImage || imageFile}
                alt="Cover"
              />
            </div>

            <div className="px-5 flex justify-between items-start mt-5 h-[5rem]">
              <Avatar
                className="transform -translate-y-24"
                sx={{ width: "10rem", height: "10rem" }}
                src={auth.user?.image || logo}
              />

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
                  {auth.user?.firstName + " " + auth.user?.lastName}
                </h1>
                <p>
                  @
                  {auth.user?.firstName?.toLowerCase() +
                    "_" +
                    auth.user?.lastName?.toLowerCase()}
                </p>
              </div>

              <div className="flex gap-2 items-center py-3">
                <span>41 post</span>
                <span>35 followers</span>
                <span>5 followings</span>
              </div>

              <div>
                <p>{auth.user?.bio || "No bio available"}</p>
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
                    {posts.map((item, index) => (
                      <div
                        key={index}
                        className="border border-slate-100 rounded-md"
                      >
                        <PostCard />
                      </div>
                    ))}
                  </div>
                )}

                {value === "reels" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 p-4">
                    {reels.map((item, index) => (
                      <UserReelsCard
                        key={index}
                        views={7460}
                        title="逆天邪神：叶家少主又给拍了CG建模大片"
                        isPinned={index === 0}
                      />
                    ))}
                  </div>
                )}

                {value === "saved" && (
                  <div className="space-y-5 w-[70%] my-10">
                    {saved.map((item, index) => (
                      <div
                        key={index}
                        className="border border-slate-100 rounded-md"
                      >
                        <PostCard />
                      </div>
                    ))}
                  </div>
                )}

                {value === "repost" && (
                  <div className="space-y-5 w-[70%] my-10">
                    {repost.map((item, index) => (
                      <div
                        key={index}
                        className="border border-slate-100 rounded-md"
                      >
                        <PostCard />
                      </div>
                    ))}
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
