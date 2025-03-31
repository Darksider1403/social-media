// redux/Story/story.reducer.js
import {
  CREATE_STORY_REQUEST,
  CREATE_STORY_SUCCESS,
  CREATE_STORY_FAILURE,
  GET_USER_STORIES_REQUEST,
  GET_USER_STORIES_SUCCESS,
  GET_USER_STORIES_FAILURE,
  GET_ALL_STORIES_REQUEST,
  GET_ALL_STORIES_SUCCESS,
  GET_ALL_STORIES_FAILURE,
} from "./story.actionType";

const initialState = {
  stories: [],
  loading: false,
  error: null,
  userStories: {}, // Stores stories by userId for caching
  createLoading: false,
  createError: null,
  getUserLoading: false,
  getUserError: null,
};

// Changed to named export
export const storyReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // Create Story
    case CREATE_STORY_REQUEST:
      return {
        ...state,
        createLoading: true,
        createError: null,
      };

    case CREATE_STORY_SUCCESS:
      // Add the new story to the stories array and to the user's stories
      return {
        ...state,
        createLoading: false,
        stories: [payload, ...state.stories],
        userStories: {
          ...state.userStories,
          [payload.user.id]: state.userStories[payload.user.id]
            ? [payload, ...state.userStories[payload.user.id]]
            : [payload],
        },
      };

    case CREATE_STORY_FAILURE:
      return {
        ...state,
        createLoading: false,
        createError: payload,
      };

    // Get User Stories
    case GET_USER_STORIES_REQUEST:
      return {
        ...state,
        getUserLoading: true,
        getUserError: null,
      };

    case GET_USER_STORIES_SUCCESS:
      // Update the cache of user stories
      const userId = payload[0]?.user?.id;
      return {
        ...state,
        getUserLoading: false,
        userStories: userId
          ? {
              ...state.userStories,
              [userId]: payload,
            }
          : state.userStories,
      };

    case GET_USER_STORIES_FAILURE:
      return {
        ...state,
        getUserLoading: false,
        getUserError: payload,
      };

    // Get All Stories
    case GET_ALL_STORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ALL_STORIES_SUCCESS:
      // Organize stories by user for easier display in the UI
      const storyByUser = {};

      if (payload && Array.isArray(payload)) {
        payload.forEach((story) => {
          const userId = story.user?.id;
          if (userId && !storyByUser[userId]) {
            storyByUser[userId] = [];
          }
          if (userId) {
            storyByUser[userId].push(story);
          }
        });
      }

      return {
        ...state,
        loading: false,
        stories: payload || [],
        userStories: {
          ...state.userStories,
          ...storyByUser,
        },
      };

    case GET_ALL_STORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};
