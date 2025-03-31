import React from "react";
import { useSelector } from "react-redux";

const ChatMessage = ({ item }) => {
  const { auth } = useSelector((store) => store);
  // Check by user ID first, fallback to email if needed
  const isCurrentUserMessage =
    item.user?.id === auth.user?.id || item.user?.email === auth.user?.email;

  console.log("Message User ID:", item.user?.id);
  console.log("Auth User ID:", auth.user?.id);
  console.log("Message User Email:", item.user?.email);
  console.log("Auth User Email:", auth.user?.email);

  return (
    <div
      className={`flex ${
        isCurrentUserMessage ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`p-1 ${item.image ? "rounded-md" : "px-5 rounded-full"} ${
          isCurrentUserMessage
            ? "bg-blue-500 text-white"
            : "bg-[#191c29] text-white"
        }`}
        style={{ maxWidth: "70%" }}
      >
        {item.image && (
          <img
            alt="message"
            className="w-[12rem] h-[17rem] object-cover rounded-md"
            src={item.image}
          />
        )}
        {item.content && (
          <p className={`${item.image ? "py-2" : "py-1"}`}>{item.content}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
