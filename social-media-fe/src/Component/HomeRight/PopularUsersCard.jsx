import { Avatar, Button, CardHeader, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";

const PopularUsersCard = ({ user }) => {
  // Check if user data exists
  if (!user) return null;

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const username =
    user.username ||
    (firstName && lastName
      ? `${firstName.toLowerCase()}_${lastName.toLowerCase()}`
      : "user");

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar
            src={user.avatar}
            sx={{
              bgcolor: user.avatar ? "transparent" : red[500],
              width: 40,
              height: 40,
            }}
            aria-label="user avatar"
          >
            {firstName ? firstName[0] : "U"}
          </Avatar>
        }
        action={<Button size="small">Follow</Button>}
        title={fullName || "User"}
        subheader={`@${username}`}
      />
    </div>
  );
};

export default PopularUsersCard;
