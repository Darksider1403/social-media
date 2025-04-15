import { Avatar, Card, CardHeader } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../redux/Auth/auth.action";
import { createChat } from "../../redux/Message/message.action";

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        dispatch(searchUser(searchTerm));
        setShowResults(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target) &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchUser = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClick = (userId) => {
    dispatch(createChat({ userId }));
    setSearchTerm("");
    setShowResults(false);
  };

  // Filter search results to match first name, last name, or username
  const filteredResults = auth.searchUser?.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const username = `${user.firstName.toLowerCase()}_${user.lastName.toLowerCase()}`;
    const query = searchTerm.toLowerCase();

    return (
      fullName.includes(query) ||
      username.includes(query) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      <div className="py-5 relative">
        <input
          ref={searchRef}
          className="bg-transparent border border-[#3b4054] outline-none w-full px-5 py-3 rounded-full"
          placeholder="Search users by name, username, or email..."
          type="text"
          value={searchTerm}
          onChange={handleSearchUser}
          onFocus={() => searchTerm.trim() && setShowResults(true)}
        />

        {showResults && searchTerm.trim() && (
          <div
            ref={resultsRef}
            className="absolute w-full z-10 top-[4.5rem] shadow-lg max-h-80 overflow-y-auto bg-white rounded-md"
          >
            {filteredResults?.length > 0 ? (
              filteredResults.map((user) => (
                <Card
                  key={user.id}
                  className="cursor-pointer hover:bg-gray-100 transition-colors border-b"
                >
                  <CardHeader
                    onClick={() => handleClick(user.id)}
                    avatar={
                      <Avatar
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                      >
                        {!user.avatar &&
                          `${user.firstName.charAt(0)}${user.lastName.charAt(
                            0
                          )}`}
                      </Avatar>
                    }
                    title={`${user.firstName} ${user.lastName}`}
                    subheader={`${user.firstName.toLowerCase()}_${user.lastName.toLowerCase()}`}
                  />
                </Card>
              ))
            ) : (
              <Card className="p-4 text-center text-gray-500">
                No users found matching "{searchTerm}"
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
