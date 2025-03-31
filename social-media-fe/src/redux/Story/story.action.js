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

// Action to get all stories from followed users
export const getAllStoriesAction = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_STORIES_REQUEST });

    // Assuming you'll create an endpoint like "/api/stories/feed" to get stories from followed users
    // If not available yet, you can implement it similar to a post feed
    const { data } = await api.get("/api/story/feed");

    dispatch({
      type: GET_ALL_STORIES_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error("Get all stories error:", error);
    dispatch({
      type: GET_ALL_STORIES_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
    throw error;
  }
};
