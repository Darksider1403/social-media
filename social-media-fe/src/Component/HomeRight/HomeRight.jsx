import React from "react";
import SearchUser from "../SearchUser/SearchUser";
import PopularUsersCard from "../HomeRight/PopularUsersCard";
import { Card } from "@mui/material";

const popularUsers = [1, 1, 1, 1, 1];
const HomeRight = () => {
  console.log("HomeRight is rendering");
  return (
    <div className="pr-5">
      <SearchUser />

      <Card className="p-5">
        <div className="flex justify-between py-5 items-center">
          <p className="font-semibold opacity-70">Suggestions for you</p>
          <p className="font-xs font-semibold opacity-95">View All</p>
        </div>

        <div>
          {popularUsers.map((item, index) => (
            <PopularUsersCard key={index} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HomeRight;
