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
import { api } from "../../config/api";

// Action to create a new story
export const createStoryAction = (storyData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_STORY_REQUEST });

    const { data } = await api.post("/api/story", storyData);

    dispatch({
      type: CREATE_STORY_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error("Create story error:", error);
    dispatch({
      type: CREATE_STORY_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
    throw error;
  }
};

// Action to get stories by user ID
export const getUserStoriesAction = (userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_STORIES_REQUEST });

    const { data } = await api.get(`/api/story/user/${userId}`);

    dispatch({
      type: GET_USER_STORIES_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error("Get stories error:", error);
    dispatch({
      type: GET_USER_STORIES_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
    throw error;
  }
};

export const getAllStoriesAction = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_STORIES_REQUEST });

    // Try to fetch from feed endpoint
    try {
      const { data } = await api.get("/api/story/feed");
      dispatch({
        type: GET_ALL_STORIES_SUCCESS,
        payload: data,
      });
      return data;
    } catch (feedError) {
      // Fallback: if feed endpoint fails, get stories from all users
      // This is temporary until the feed endpoint is implemented
      console.warn("Story feed endpoint not available, fetching all stories");
      const { data } = await api.get("/api/story/all");
      dispatch({
        type: GET_ALL_STORIES_SUCCESS,
        payload: data,
      });
      return data;
    }
  } catch (error) {
    console.error("Get all stories error:", error);
    dispatch({
      type: GET_ALL_STORIES_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });

    // Return empty array instead of throwing to prevent app crashes
    dispatch({
      type: GET_ALL_STORIES_SUCCESS,
      payload: [],
    });
    return [];
  }
};
