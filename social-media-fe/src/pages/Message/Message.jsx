import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Alert,
  Snackbar,
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
import {
  createMessage,
  getAllChats,
  getChatMessages,
} from "../../redux/Message/message.action";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Message = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, auth } = useSelector((store) => store);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [error, setError] = useState(null);

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
    const loadChats = async () => {
      try {
        await dispatch(getAllChats());
      } catch (err) {
        console.error("Failed to load chats:", err);
        setError("Failed to load chat list. Please try again.");
      }
    };

    loadChats();
  }, [dispatch]);

  // Connect to WebSocket
  useEffect(() => {
    if (!auth.user?.id || !auth.token) return;

    console.log("Setting up WebSocket connection for chat...");

    try {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        connectHeaders: {
          Authorization: `Bearer ${auth.token}`,
        },
        debug: function (str) {
          console.log("STOMP Chat: " + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: function () {
          console.log("Chat WebSocket connected successfully");

          // Subscribe to message updates for this user
          client.subscribe(
            `/user/${auth.user.id}/queue/messages`,
            function (message) {
              try {
                console.log("New chat message received:", message);
                const receivedMessage = JSON.parse(message.body);

                // Add the message to the current chat if we're viewing it
                if (
                  currentChat &&
                  (receivedMessage.chat?.id === currentChat.id ||
                    receivedMessage.chatId === currentChat.id)
                ) {
                  setMessages((prev) => {
                    // Check if message already exists in the array
                    if (!prev.some((msg) => msg.id === receivedMessage.id)) {
                      return [...prev, receivedMessage];
                    }
                    return prev;
                  });

                  // Scroll to bottom when receiving new messages
                  setTimeout(scrollToBottom, 100);
                }
              } catch (error) {
                console.error("Error processing message:", error);
              }
            }
          );
        },

        onStompError: function (frame) {
          console.error("Broker reported error: " + frame.headers["message"]);
          console.error("Additional details: " + frame.body);
          setError("Connection error. Messages may not update in real-time.");
        },
      });

      client.activate();
      setStompClient(client);

      // Cleanup function
      return () => {
        if (client && client.active) {
          console.log("Disconnecting chat WebSocket");
          client.deactivate();
        }
      };
    } catch (err) {
      console.error("WebSocket setup error:", err);
    }
  }, [auth.user?.id, auth.token, currentChat]);

  // Fetch messages when a chat is selected
  const fetchMessages = async (chatId) => {
    if (!chatId) return;

    setLoading(true);
    try {
      dispatch(getChatMessages(chatId));

      // Get messages from the message store
      const chatMessages = message.chatMessagesMap[chatId] || [];
      console.log("Loaded messages for chat:", chatId, chatMessages);

      // Ensure messages are sorted by timestamp
      const sortedMessages = [...chatMessages].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
      setMessages([]);
    } finally {
      setLoading(false);
      // Scroll to bottom after loading messages
      setTimeout(scrollToBottom, 100);
    }
  };

  // Update local messages when Redux state changes
  useEffect(() => {
    if (
      currentChat?.id &&
      message.chatMessagesMap &&
      message.chatMessagesMap[currentChat.id]
    ) {
      const chatMessages = message.chatMessagesMap[currentChat.id];
      const sortedMessages = [...chatMessages].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sortedMessages);
    }
  }, [message.chatMessagesMap, currentChat]);

  // Handle new messages from Redux
  useEffect(() => {
    if (message.message && currentChat) {
      const chatId = currentChat.id;
      const messageChat = message.message.chat?.id || message.message.chatId;

      if (chatId === messageChat) {
        // Check if message already exists in our local state
        setMessages((prev) => {
          if (!prev.some((msg) => msg.id === message.message.id)) {
            return [...prev, message.message];
          }
          return prev;
        });

        // Schedule scroll after state update
        setTimeout(scrollToBottom, 100);
      }
    }
  }, [message.message, currentChat]);

  // Scroll when messages change
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const handleSelectImage = async (e) => {
    if (!e.target.files[0]) return;

    setLoading(true);
    try {
      const imgUrl = await uploadToCloudinary(e.target.files[0], "image");
      setSelectedImage(imgUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async () => {
    if ((!messageText || messageText.trim() === "") && !selectedImage) {
      return; // Don't send empty messages
    }

    if (!currentChat || !currentChat.id) {
      setError("No chat selected");
      return;
    }

    const messageData = {
      chatId: currentChat.id,
      content: messageText.trim(),
      image: selectedImage || null,
    };

    console.log("Sending message:", messageData);

    // Create optimistic message
    const optimisticMessage = {
      id: `temp-${Date.now()}`, // Temporary ID
      content: messageText.trim(),
      image: selectedImage,
      user: auth.user,
      timestamp: new Date().toISOString(),
      chat: currentChat,
      chatId: currentChat.id, // Add explicit chatId for safety
    };

    // Add optimistic message to UI
    setMessages((prev) => [...prev, optimisticMessage]);

    // Clear input and selected image before sending
    const messageTextCopy = messageText.trim();
    const selectedImageCopy = selectedImage;
    setSelectedImage(null);
    setMessageText("");

    // Scroll to bottom after clearing input
    setTimeout(scrollToBottom, 50);

    try {
      // Dispatch the action to create the message
      await dispatch(createMessage(messageData));
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message. Please try again.");

      // If the message fails to send, restore the input
      if (messageTextCopy) {
        setMessageText(messageTextCopy);
      }
      if (selectedImageCopy) {
        setSelectedImage(selectedImageCopy);
      }

      // Remove the optimistic message
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateMessage();
    }
  };

  const handleChatSelect = (chat) => {
    if (!chat || !chat.id) {
      console.error("Invalid chat selected:", chat);
      return;
    }

    setCurrentChat(chat);
    fetchMessages(chat.id);
  };

  // Find the other user in the chat
  const getOtherUser = (chat) => {
    if (
      !chat ||
      !chat.users ||
      !Array.isArray(chat.users) ||
      chat.users.length === 0
    ) {
      return { firstName: "User", lastName: "" };
    }

    // Handle case where user array might be empty
    if (chat.users.length === 0) {
      return { firstName: "User", lastName: "" };
    }

    // Find the other user
    const otherUser = chat.users.find(
      (user) => user && user.id !== auth.user?.id
    );

    // Fallback if somehow we can't find the other user
    return otherUser || chat.users[0] || { firstName: "User", lastName: "" };
  };

  // Close error snackbar
  const handleCloseError = () => {
    setError(null);
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
                    key={item.id || Math.random()}
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
                  {message.loading ? "Loading chats..." : "No chats available"}
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
                    src={getOtherUser(currentChat)?.avatar}
                    alt={getOtherUser(currentChat)?.firstName}
                  >
                    {getOtherUser(currentChat)
                      ?.firstName?.charAt(0)
                      .toUpperCase() || "U"}
                  </Avatar>
                  <p className="font-medium">
                    {`${getOtherUser(currentChat)?.firstName || "User"} ${
                      getOtherUser(currentChat)?.lastName || ""
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
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <CircularProgress size={40} />
                  </div>
                ) : messages && messages.length > 0 ? (
                  <>
                    {messages.map(
                      (item) =>
                        item && (
                          <ChatMessage
                            key={item.id || `msg-${Math.random()}`}
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

      {/* Loading backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Error snackbar */}
      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Message;
