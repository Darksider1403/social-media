import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const navigationMenu = [
  {
    title: "Home",
    icon: <HomeIcon />,
    path: "/home", // Changed from "/" to "/home"
  },
  {
    title: "Reels",
    icon: <ExploreIcon />,
    path: "/home/reels", // Changed to be nested under /home
  },
  {
    title: "Create Reels",
    icon: <ControlPointIcon />,
    path: "/home/create-reels", // Changed to be nested under /home
  },
  {
    title: "Notifications",
    icon: <NotificationsIcon />,
    path: "/home/notifications",
  },
  {
    title: "Message",
    icon: <MessageIcon />,
    path: "/message",
  },
  {
    title: "Lists",
    icon: <ListAltIcon />,
    path: "/home/lists",
  },
  {
    title: "Communities",
    icon: <GroupIcon />,
    path: "/home/communities",
  },
  {
    title: "Profile",
    icon: <AccountCircleIcon />,
    path: "/profile",
  },
];
