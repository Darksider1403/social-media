import * as React from "react";
import { navigationMenu } from "./SidebarNavigation";
import { Avatar, Card, Divider } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../redux/Auth/auth.action";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Get user data with proper avatar handling
  const user = auth?.user || {};
  const userAvatar = user.avatar || null;
  const userFirstName = user.firstName || "User";
  const userLastName = user.lastName || "";
  const userInitial = userFirstName
    ? userFirstName.charAt(0).toUpperCase()
    : "U";
  const userHandle =
    user.username ||
    (userFirstName && userLastName
      ? `${userFirstName.toLowerCase()}_${userLastName.toLowerCase()}`
      : "username");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (item) => {
    if (item.title === "Profile") {
      // Use the username or construct one from first and last name
      const username =
        user.username ||
        (userFirstName && userLastName
          ? `${userFirstName.toLowerCase()}_${userLastName.toLowerCase()}`
          : `user_${auth.user?.id}`);

      navigate(`/profile/@${username}`);
    } else {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    try {
      dispatch(logoutAction());
    } catch (e) {
      console.error("Error during logout:", e);
    }
    navigate("/login");
    handleClose();
  };

  const handleProfileClick = () => {
    // Use the username or construct one from first and last name
    const username =
      user.username ||
      (userFirstName && userLastName
        ? `${userFirstName.toLowerCase()}_${userLastName.toLowerCase()}`
        : `user_${auth.user?.id}`);

    navigate(`/profile/@${username}`);
    handleClose();
  };

  return (
    <Card
      className="h-screen overflow-y-auto"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "25%",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top section with logo and navigation */}
      <div className="overflow-y-auto">
        <div className="p-5 cursor-pointer" onClick={() => navigate("/home")}>
          <span className="logo font-bold text-xl">Darksider Social</span>
        </div>

        <div className="space-y-1 mt-4">
          {navigationMenu.map((item) => (
            <div
              key={item.title}
              className="cursor-pointer flex space-x-3 items-center hover:bg-gray-100 rounded-l-full p-3 mx-2"
              onClick={() => handleNavigation(item)}
            >
              {item.icon}
              <p className="text-base">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section with user profile */}
      <div className="mt-auto">
        <Divider />
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 max-w-[70%]">
            <Avatar
              src={userAvatar}
              alt={userFirstName}
              sx={{
                bgcolor: userAvatar ? "transparent" : "primary.main",
                width: 40,
                height: 40,
              }}
            >
              {!userAvatar && userInitial}
            </Avatar>
            <div className="truncate">
              <p className="font-bold truncate">
                {`${userFirstName} ${userLastName}`.trim()}
              </p>
              <p className="opacity-70 truncate">@{userHandle}</p>
            </div>
          </div>

          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreHorizIcon />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </Card>
  );
};

export default Sidebar;
