import { Avatar, Button, CardHeader } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import { normalizeUsername } from "../../utils/stringUtils"; // Import the normalizeUsername function

const PopularUsersCard = ({ user }) => {
  // Check if user data exists
  if (!user) return null;

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  // Use normalizeUsername to remove diacritics
  const username =
    user.username || normalizeUsername(firstName, lastName) || "user";

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
