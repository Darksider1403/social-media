import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchUser from "../SearchUser/SearchUser";
import PopularUsersCard from "../HomeRight/PopularUsersCard";
import { Card, CircularProgress } from "@mui/material";
import { searchUser } from "../../redux/Auth/auth.action";

const HomeRight = () => {
  const dispatch = useDispatch();
  const { searchUser: allUsers, loading } = useSelector((state) => state.auth);
  const { user: currentUser } = useSelector((state) => state.auth);

  // State to store random suggestions
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // Fetch all users when component mounts
  useEffect(() => {
    dispatch(searchUser(""));
  }, [dispatch]);

  // Generate random user suggestions when allUsers changes
  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      // Filter out the current user
      const filteredUsers = allUsers.filter(
        (user) => user.id !== currentUser?.id
      );

      // Get 5 random users for suggestions
      const getRandomUsers = (users, count) => {
        const shuffled = [...users].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      setSuggestedUsers(getRandomUsers(filteredUsers, 5));
    }
  }, [allUsers, currentUser]);

  return (
    <div className="pr-5">
      <SearchUser />

      <Card className="p-5">
        <div className="flex justify-between py-5 items-center">
          <p className="font-semibold opacity-70">Suggestions for you</p>
          <p
            className="font-xs font-semibold opacity-95 cursor-pointer"
            onClick={() => {
              // Reshuffle suggestions when clicking "View All"
              if (allUsers && allUsers.length > 0) {
                const filteredUsers = allUsers.filter(
                  (user) => user.id !== currentUser?.id
                );
                const newSuggestions = [...filteredUsers]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 5);
                setSuggestedUsers(newSuggestions);
              }
            }}
          >
            Refresh
          </p>
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center p-4">
              <CircularProgress size={24} />
            </div>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
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
