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
import { api } from "../../config/api";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

// Action to create a new reel
export const createReelAction = (reelData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_REEL_REQUEST });

    // Upload video to Cloudinary first
    const videoUrl = await uploadToCloudinary(reelData.video, "video");

    if (!videoUrl) {
      throw new Error("Failed to upload video to Cloudinary");
    }

    // Create payload for backend
    const reelPayload = {
      title: reelData.title,
      description: reelData.description || "",
      video: videoUrl,
    };

    const { data } = await api.post("/api/reels", reelPayload);

    dispatch({
      type: CREATE_REEL_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error("Create reel error:", error);
    dispatch({
      type: CREATE_REEL_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
    throw error;
  }
};

// Action to get reels by user ID
export const getUserReelsAction = (userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_REELS_REQUEST });

    const { data } = await api.get(`/api/reels/user/${userId}`);

    dispatch({
      type: GET_USER_REELS_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error("Get user reels error:", error);
    dispatch({
      type: GET_USER_REELS_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
    throw error;
  }
};

// Action to get all reels
export const getAllReelsAction = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_REELS_REQUEST });

    const { data } = await api.get("/api/reels");

    dispatch({
      type: GET_ALL_REELS_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error("Get all reels error:", error);
    dispatch({
      type: GET_ALL_REELS_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
    throw error;
  }
};
