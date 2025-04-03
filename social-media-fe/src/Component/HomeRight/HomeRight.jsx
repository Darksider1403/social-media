import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchUser from "../SearchUser/SearchUser";
import PopularUsersCard from "../HomeRight/PopularUsersCard";
import { Card, CircularProgress } from "@mui/material";
import { searchUser } from "../../redux/Auth/auth.action";

const HomeRight = () => {
  const dispatch = useDispatch();
  const { searchUser: suggestedUsers, loading } = useSelector(
    (state) => state.auth
  );
  const { user: currentUser } = useSelector((state) => state.auth);

  // Fetch suggested users when component mounts
  useEffect(() => {
    // You can adjust the query to get more appropriate suggestions
    dispatch(searchUser(""));
  }, [dispatch]);

  // Filter out the current user from suggestions, if needed
  const filteredUsers =
    suggestedUsers?.filter((user) => user.id !== currentUser?.id).slice(0, 5) ||
    [];

  return (
    <div className="pr-5">
      <SearchUser />

      <Card className="p-5">
        <div className="flex justify-between py-5 items-center">
          <p className="font-semibold opacity-70">Suggestions for you</p>
          <p className="font-xs font-semibold opacity-95 cursor-pointer">
            View All
          </p>
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center p-4">
              <CircularProgress size={24} />
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <PopularUsersCard key={user.id} user={user} />
            ))
          ) : (
            <p className="text-center py-3 text-gray-500">
              No suggestions available
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomeRight;
