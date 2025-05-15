import { api } from "../../config/api";
import {
  CREATE_CHAT_FAILURE,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  CREATE_MESSAGE_FAILURE,
  CREATE_MESSAGE_REQUEST,
  CREATE_MESSAGE_SUCCESS,
  GET_ALL_CHATS_FAILURE,
  GET_ALL_CHATS_REQUEST,
  GET_ALL_CHATS_SUCCESS,
  GET_CHAT_MESSAGES_REQUEST,
  GET_CHAT_MESSAGES_SUCCESS,
  GET_CHAT_MESSAGES_FAILURE,
} from "./message.actionType";

// Create a new message in a chat
export const createMessage = (message) => async (dispatch) => {
  dispatch({ type: CREATE_MESSAGE_REQUEST });
  try {
    // Ensure we have a chatId
    if (!message.chatId) {
      throw new Error("Chat ID is required to create a message");
    }

    const { data } = await api.post(
      `/api/messages/chat/${message.chatId}`,
      message
    );

    console.log("Create Message Action: ", data);

    // Ensure the response includes the correct chat reference
    // If the API doesn't include the chat object, add it manually
    const enhancedData = {
      ...data,
      // Keep the existing chat reference if available, otherwise create it
      chat: data.chat || { id: message.chatId },
      // Include chatId as a direct property as well for safety
      chatId: message.chatId,
    };

    dispatch({
      type: CREATE_MESSAGE_SUCCESS,
      payload: enhancedData,
    });

    return enhancedData;
  } catch (error) {
    console.log("Create Message Action Error: ", error);
    dispatch({
      type: CREATE_MESSAGE_FAILURE,
      payload: error.response?.data || error.message,
    });
    throw error;
  }
};

// Create a new chat with another user - matches your ChatController format exactly
export const createChat = (chat) => async (dispatch) => {
  dispatch({ type: CREATE_CHAT_REQUEST });
  try {
    // Validate that we have a userId
    if (!chat || !chat.userId) {
      throw new Error("User ID is required to create a chat");
    }

    // Make API request with the correct data structure - exact match to your controller
    const { data } = await api.post(`/api/chats`, {
      userId: chat.userId,
    });

    console.log("Create chat Action: ", data);

    // Ensure the chat has an ID
    if (!data || !data.id) {
      throw new Error("Invalid chat data received from API");
    }

    // Initialize empty messages array if not present
    const enhancedData = {
      ...data,
      messages: data.messages || [],
    };

    dispatch({ type: CREATE_CHAT_SUCCESS, payload: enhancedData });
    return enhancedData;
  } catch (error) {
    console.log("Create chat Action Error: ", error);
    dispatch({
      type: CREATE_CHAT_FAILURE,
      payload: error.response?.data || error.message,
    });
    throw error;
  }
};

// Get all chats for the current user
export const getAllChats = () => async (dispatch) => {
  dispatch({ type: GET_ALL_CHATS_REQUEST });
  try {
    const { data } = await api.get(`/api/chats`);
    console.log("Get all Chats Action: ", data);

    // Ensure we have an array of chats
    const enhancedData = Array.isArray(data)
      ? data.map((chat) => ({
          ...chat,
          messages: chat.messages || [],
        }))
      : [];

    dispatch({ type: GET_ALL_CHATS_SUCCESS, payload: enhancedData });
    return enhancedData;
  } catch (error) {
    console.log("Get all Chats Action Error: ", error);
    dispatch({
      type: GET_ALL_CHATS_FAILURE,
      payload: error.response?.data || error.message,
    });
    throw error;
  }
};

// Get messages for a specific chat
export const getChatMessages = (chatId) => async (dispatch) => {
  if (!chatId) {
    console.error("Chat ID is required to fetch messages");
    return;
  }

  dispatch({ type: GET_CHAT_MESSAGES_REQUEST });
  try {
    const { data } = await api.get(`/api/messages/chat/${chatId}`);
    console.log("Get Chat Messages Action: ", data);

    // Ensure we have an array of messages
    const messagesArray = Array.isArray(data) ? data : [];

    dispatch({
      type: GET_CHAT_MESSAGES_SUCCESS,
      payload: {
        chatId,
        messages: messagesArray,
      },
    });

    return messagesArray;
  } catch (error) {
    console.log("Get Chat Messages Action Error: ", error);
    dispatch({
      type: GET_CHAT_MESSAGES_FAILURE,
      payload: error.response?.data || error.message,
    });
    throw error;
  }
};
