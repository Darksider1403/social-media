import { Avatar, Card, CardHeader, IconButton } from "@mui/material";
import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useSelector } from "react-redux";

const UserChatCard = ({ chat }) => {
  const { auth } = useSelector((store) => store);

  // Get the other user in the chat
  const getOtherUser = () => {
    if (!chat || !chat.users || !Array.isArray(chat.users)) {
      return { firstName: "User", lastName: "" };
    }

    // Find the user that is not the current user
    const otherUser = chat.users.find((user) => user.id !== auth.user?.id);

    // If somehow we can't find another user, use the first user
    return otherUser || chat.users[0] || { firstName: "User", lastName: "" };
  };

  // Get last message preview
  const getLastMessagePreview = () => {
    if (
      !chat ||
      !chat.messages ||
      !Array.isArray(chat.messages) ||
      chat.messages.length === 0
    ) {
      return "Start a conversation";
    }

    // Sort messages by timestamp and get the latest one
    const sortedMessages = [...chat.messages].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const lastMessage = sortedMessages[0];

    if (!lastMessage) return "No messages";

    if (lastMessage.image && !lastMessage.content) {
      return "📷 Photo";
    }

    // Truncate long messages
    return lastMessage.content?.length > 25
      ? `${lastMessage.content.substring(0, 25)}...`
      : lastMessage.content || "New message";
  };

  // Format timestamp to show date if old, time if today
  const formatTimestamp = () => {
    if (
      !chat ||
      !chat.messages ||
      !Array.isArray(chat.messages) ||
      chat.messages.length === 0
    ) {
      return "";
    }

    // Sort messages by timestamp and get the latest one
    const sortedMessages = [...chat.messages].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const lastMessageTime = sortedMessages[0]?.timestamp;

    if (!lastMessageTime) return "";

    const messageDate = new Date(lastMessageTime);
    const today = new Date();

    // If the message is from today, show the time
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If the message is from yesterday, show "Yesterday"
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Otherwise, show the date
    return messageDate.toLocaleDateString();
  };

  const otherUser = getOtherUser();

  // Get avatar URL - handles different field names (avatar or image)
  const getAvatarUrl = (user) => {
    if (!user) return "";

    // Check for avatar field first (from your DB)
    if (user.avatar) return user.avatar;

    // Fallback to image field if it exists
    if (user.image) return user.image;

    return "";
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              width: "3.5rem",
              height: "3.5rem",
              fontSize: "1.5rem",
              bgcolor: "#191c29",
              color: "rgb(88, 199, 250)",
            }}
            src={getAvatarUrl(otherUser)}
          >
            {otherUser.firstName
              ? otherUser.firstName.charAt(0).toUpperCase()
              : "U"}
          </Avatar>
        }
        action={
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-1">
              {formatTimestamp()}
            </span>
            <IconButton size="small">
              <MoreHorizIcon />
            </IconButton>
          </div>
        }
        title={
          <div className="font-semibold">
            {`${otherUser.firstName || ""} ${otherUser.lastName || ""}`}
          </div>
        }
        subheader={
          <div className="text-sm text-gray-600 truncate w-48">
            {getLastMessagePreview()}
          </div>
        }
      />
    </Card>
  );
};

export default UserChatCard;
