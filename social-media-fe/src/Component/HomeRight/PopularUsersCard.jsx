import { Avatar, Button, CardHeader, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";

const PopularUsersCard = () => {
  return (
    <div>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            D
          </Avatar>
        }
        action={<Button size="small">Follow</Button>}
        title="Darksider"
        subheader="@Darksider1403"
      />
    </div>
  );
};

export default PopularUsersCard;
