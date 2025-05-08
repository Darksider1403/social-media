import {
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  CREATE_CHAT_FAILURE,
  CREATE_MESSAGE_REQUEST,
  CREATE_MESSAGE_SUCCESS,
  CREATE_MESSAGE_FAILURE,
  GET_ALL_CHATS_REQUEST,
  GET_ALL_CHATS_SUCCESS,
  GET_ALL_CHATS_FAILURE,
  GET_CHAT_MESSAGES_REQUEST,
  GET_CHAT_MESSAGES_SUCCESS,
  GET_CHAT_MESSAGES_FAILURE,
} from "./message.actionType";

const initialState = {
  messages: [],
  chats: [],
  loading: false,
  error: null,
  message: null,
  chatMessagesMap: {}, // Store messages by chat ID
};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create message actions
    case CREATE_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_MESSAGE_SUCCESS:
      // Safe access to nested properties with fallbacks
      const chatId = action.payload?.chat?.id || action.payload?.chatId;

      // If we don't have a valid chat ID, just update the message without updating chats
      if (!chatId) {
        return {
          ...state,
          loading: false,
          message: action.payload,
        };
      }

      return {
        ...state,
        loading: false,
        message: action.payload,
        // Update the chat's messages array if we have this chat
        chats: state.chats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...(chat.messages || []), action.payload],
            };
          }
          return chat;
        }),
        // Also update the chatMessagesMap
        chatMessagesMap: {
          ...state.chatMessagesMap,
          [chatId]: [...(state.chatMessagesMap[chatId] || []), action.payload],
        },
      };

    case CREATE_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Create chat actions
    case CREATE_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_CHAT_SUCCESS:
      // Safely access ID
      const newChatId = action.payload?.id;
      if (!newChatId) {
        return {
          ...state,
          loading: false,
        };
      }

      return {
        ...state,
        loading: false,
        chats: [action.payload, ...state.chats],
        chatMessagesMap: {
          ...state.chatMessagesMap,
          [newChatId]: [],
        },
      };

    case CREATE_CHAT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get all chats actions
    case GET_ALL_CHATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ALL_CHATS_SUCCESS:
      // Handle the case where payload might not be an array
      const chatsArray = Array.isArray(action.payload) ? action.payload : [];

      // Safely build the messages map
      const messagesMap = {};
      chatsArray.forEach((chat) => {
        if (chat && chat.id) {
          messagesMap[chat.id] = chat.messages || [];
        }
      });

      return {
        ...state,
        loading: false,
        chats: chatsArray,
        chatMessagesMap: {
          ...state.chatMessagesMap,
          ...messagesMap,
        },
      };

    case GET_ALL_CHATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get chat messages actions
    case GET_CHAT_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_CHAT_MESSAGES_SUCCESS:
      // Safely access chat ID from payload
      const messagesChatId = action.payload?.chatId;
      const messagesData = action.payload?.messages || [];

      if (!messagesChatId) {
        return {
          ...state,
          loading: false,
        };
      }

      return {
        ...state,
        loading: false,
        chatMessagesMap: {
          ...state.chatMessagesMap,
          [messagesChatId]: messagesData,
        },
        // Also update the messages in the chat object
        chats: state.chats.map((chat) => {
          if (chat.id === messagesChatId) {
            return {
              ...chat,
              messages: messagesData,
            };
          }
          return chat;
        }),
      };

    case GET_CHAT_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
