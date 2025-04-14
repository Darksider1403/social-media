import {
  CREATE_REEL_REQUEST,
  CREATE_REEL_SUCCESS,
  CREATE_REEL_FAILURE,
  GET_USER_REELS_REQUEST,
  GET_USER_REELS_SUCCESS,
  GET_USER_REELS_FAILURE,
  GET_ALL_REELS_REQUEST,
  GET_ALL_REELS_SUCCESS,
  GET_ALL_REELS_FAILURE,
} from "./reels.actionType";

const initialState = {
  reels: [],
  loading: false,
  error: null,
  userReels: {}, // Stores reels by userId for caching
  createLoading: false,
  createError: null,
  getUserLoading: false,
  getUserError: null,
};

export const reelsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // Create Reel
    case CREATE_REEL_REQUEST:
      return {
        ...state,
        createLoading: true,
        createError: null,
      };

    case CREATE_REEL_SUCCESS:
      // Add the new reel to the reels array and to the user's reels
      return {
        ...state,
        createLoading: false,
        reels: [payload, ...state.reels],
        userReels: {
          ...state.userReels,
          [payload.user.id]: state.userReels[payload.user.id]
            ? [payload, ...state.userReels[payload.user.id]]
            : [payload],
        },
      };

    case CREATE_REEL_FAILURE:
      return {
        ...state,
        createLoading: false,
        createError: payload,
      };

    // Get User Reels
    case GET_USER_REELS_REQUEST:
      return {
        ...state,
        getUserLoading: true,
        getUserError: null,
      };

    case GET_USER_REELS_SUCCESS:
      // Update the cache of user reels
      const userId = payload.length > 0 ? payload[0].user?.id : null;
      return {
        ...state,
        getUserLoading: false,
        userReels: userId
          ? {
              ...state.userReels,
              [userId]: payload,
            }
          : state.userReels,
      };

    case GET_USER_REELS_FAILURE:
      return {
        ...state,
        getUserLoading: false,
        getUserError: payload,
      };

    // Get All Reels
    case GET_ALL_REELS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ALL_REELS_SUCCESS:
      // Organize reels by user for easier access
      const reelsByUser = {};

      if (payload && Array.isArray(payload)) {
        payload.forEach((reel) => {
          const userId = reel.user?.id;
          if (userId && !reelsByUser[userId]) {
            reelsByUser[userId] = [];
          }
          if (userId) {
            reelsByUser[userId].push(reel);
          }
        });
      }

      return {
        ...state,
        loading: false,
        reels: payload || [],
        userReels: {
          ...state.userReels,
          ...reelsByUser,
        },
      };

    case GET_ALL_REELS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};
