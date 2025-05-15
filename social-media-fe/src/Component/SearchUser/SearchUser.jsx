import React, { useState, useEffect } from "react";
import { api } from "../../config/api";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createChat } from "../../redux/Message/message.action";
import { useNavigate } from "react-router-dom";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const searchUsers = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await api.get(`/api/users/search?query=${query}`);
      console.log("Search results:", data);

      // Filter out current user from search results
      const filteredUsers = Array.isArray(data)
        ? data.filter((user) => user.id !== auth.user?.id)
        : [];

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      setError("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = async (user) => {
    if (!user || !user.id) {
      console.error("Invalid user", user);
      setError("Invalid user selection");
      return;
    }

    try {
      setLoading(true);

      // Create the chat with the exact format your controller expects
      const chatData = {
        userId: user.id,
      };

      console.log("Creating chat with user:", user.id);

      // Dispatch the create chat action
      const result = await dispatch(createChat(chatData));
      console.log("Chat created:", result);

      if (result && result.id) {
        setQuery(""); // Clear search
        setUsers([]); // Clear results

        // Navigate to the chat view or refresh chats
        // Uncomment if you want to navigate to a specific chat
        // navigate(`/messages/${result.id}`);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      setError("Failed to create chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          className="bg-transparent border border-[#3b4054] rounded-full w-full py-2 px-4"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && (
          <div className="absolute right-3 top-2">
            <CircularProgress size={20} />
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm mt-2 px-2">{error}</div>}

      {users.length > 0 && (
        <div className="mt-4 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id || Math.random()}
              className="flex justify-between items-center p-2 border-b hover:bg-gray-100 rounded cursor-pointer"
            >
              <div className="flex items-center">
                <Avatar
                  src={user.avatar}
                  alt={user.firstName}
                  sx={{ width: 40, height: 40, marginRight: 2 }}
                >
                  {user.firstName
                    ? user.firstName.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
                <div>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleCreateChat(user)}
                disabled={loading}
                sx={{ minWidth: 0, px: 2 }}
              >
                Chat
              </Button>
            </div>
          ))}
        </div>
      )}

      {query && users.length === 0 && !loading && !error && (
        <div className="text-center p-4 text-gray-500">
          No users found matching '{query}'
        </div>
      )}
    </div>
  );
};

export default SearchUser;
