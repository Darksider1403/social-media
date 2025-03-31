import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import WestIcon from "@mui/icons-material/West";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SearchUser from "../../Component/SearchUser/SearchUser";
import "./Message.css";
import UserChatCard from "./UserChatCard";
import ChatMessage from "./ChatMessage";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, getAllChats } from "../../redux/Message/message.action";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const Message = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, auth } = useSelector((store) => store);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [stompClient, setStompClient] = useState(null);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (messagesContainerRef.current) {
      // Fallback if the end ref isn't available
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  // Load chats when component mounts
  useEffect(() => {
    dispatch(getAllChats());
  }, [dispatch]);

  // Handle new messages from Redux
  useEffect(() => {
    if (message.message && message.message.id) {
      // Only add the message if it's not already in the array
      if (!messages.some((msg) => msg.id === message.message.id)) {
        setMessages((prev) => [...prev.filter(Boolean), message.message]);
      }

      // Schedule scroll after state update
      setTimeout(scrollToBottom, 100);
    }
  }, [message.message]);

  // Scroll when messages change or a new chat is selected
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [currentChat]);

  const handleSelectImage = async (e) => {
    if (!e.target.files[0]) return;

    setLoading(true);
    try {
      const imgUrl = await uploadToCloudinary(e.target.files[0], "image");
      setSelectedImage(imgUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = () => {
    if ((!messageText || messageText.trim() === "") && !selectedImage) {
      return; // Don't send empty messages
    }

    const messageData = {
      chatId: currentChat?.id,
      content: messageText.trim(),
      image: selectedImage || null,
    };

    console.log("Sending message:", messageData);
    dispatch(createMessage(messageData));

    // Optimistic update - add message to UI immediately
    const optimisticMessage = {
      id: Date.now(), // Temporary ID
      content: messageText.trim(),
      image: selectedImage,
      user: auth.user,
      timestamp: new Date().toISOString(),
      chat: currentChat,
    };

    setMessages((prev) => [...prev.filter(Boolean), optimisticMessage]);

    // Clear input and selected image after sending
    setSelectedImage(null);
    setMessageText("");

    // Scroll to bottom after sending
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateMessage();
    }
  };

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);

    // Filter out null/undefined messages and deduplicate by ID
    const validMessages = (chat.messages || []).filter(Boolean);
    const uniqueMessages = [];
    const messageIds = new Set();

    for (const msg of validMessages) {
      if (msg && msg.id && !messageIds.has(msg.id)) {
        messageIds.add(msg.id);
        uniqueMessages.push(msg);
      }
    }

    // Sort messages by timestamp
    uniqueMessages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    setMessages(uniqueMessages);
  };

  return (
    <div>
      <Box className="h-screen overflow-y-hidden" sx={{ display: "flex" }}>
        {/* Left side */}
        <Box sx={{ width: "25%", px: 2, borderRight: "1px solid #eee" }}>
          <div className="flex h-full flex-col">
            <div className="flex space-x-4 items-center py-5">
              <IconButton onClick={() => navigate("/home")}>
                <WestIcon />
              </IconButton>
              <h1 className="text-xl font-bold">Messages</h1>
            </div>

            <div className="mb-4">
              <SearchUser />
            </div>

            <div className="flex-grow overflow-y-auto hideScrollbar">
              {message.chats && message.chats.length > 0 ? (
                message.chats.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleChatSelect(item)}
                    className={`cursor-pointer ${
                      currentChat?.id === item.id ? "bg-blue-50 rounded-lg" : ""
                    }`}
                  >
                    <UserChatCard chat={item} />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-5">
                  No chats available
                </div>
              )}
            </div>
          </div>
        </Box>

        {/* Right side */}
        <Box
          sx={{
            width: "75%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {currentChat ? (
            <>
              <div className="flex justify-between items-center border-b p-4">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={
                      auth.user.id === currentChat.users[0]?.id
                        ? currentChat.users[1]?.image
                        : currentChat.users[0]?.image
                    }
                  />
                  <p className="font-medium">
                    {auth.user.id === currentChat.users[0]?.id
                      ? `${currentChat.users[1]?.firstName || ""} ${
                          currentChat.users[1]?.lastName || ""
                        }`
                      : `${currentChat.users[0]?.firstName || ""} ${
                          currentChat.users[0]?.lastName || ""
                        }`}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <IconButton>
                    <AddIcCallIcon />
                  </IconButton>
                  <IconButton>
                    <VideoCallIcon />
                  </IconButton>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-grow overflow-y-auto hideScrollbar p-4 space-y-4"
              >
                {messages && messages.length > 0 ? (
                  <>
                    {messages.map(
                      (item) =>
                        item && (
                          <ChatMessage
                            key={item.id || Date.now()}
                            item={item}
                          />
                        )
                    )}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t">
                {selectedImage && (
                  <div className="px-4 pt-3">
                    <div className="relative inline-block">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="h-20 rounded-md"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-1 right-1 bg-gray-800 rounded-full p-1 text-white"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                <div className="py-3 px-4 flex items-center space-x-3">
                  <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-transparent border border-gray-300 rounded-full flex-grow py-3 px-5"
                    placeholder="Type a message..."
                    disabled={loading}
                  />

                  <label htmlFor="image-input" className="cursor-pointer">
                    <IconButton
                      color="primary"
                      component="span"
                      disabled={loading}
                    >
                      <AddPhotoAlternateIcon />
                    </IconButton>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelectImage}
                      className="hidden"
                      id="image-input"
                      disabled={loading}
                    />
                  </label>

                  <IconButton
                    color="primary"
                    onClick={handleCreateMessage}
                    disabled={
                      loading || (!messageText.trim() && !selectedImage)
                    }
                  >
                    <SendIcon />
                  </IconButton>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col justify-center items-center space-y-5 text-gray-400">
              <ChatBubbleOutlineIcon sx={{ fontSize: "10rem" }} />
              <p className="text-xl font-semibold">
                Select a chat to start messaging
              </p>
            </div>
          )}
        </Box>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Message;
