import { api } from "../../config/api";
import {
  CREATE_COMMENT_FAILURE,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_POSTS_FAILURE,
  CREATE_POSTS_REQUEST,
  CREATE_POSTS_SUCCESS,
  GET_ALL_POSTS_FAILURE,
  GET_ALL_POSTS_REQUEST,
  GET_ALL_POSTS_SUCCESS,
  GET_USERS_POSTS_FAILURE,
  GET_USERS_POSTS_REQUEST,
  GET_USERS_POSTS_SUCCESS,
  LIKE_POSTS_FAILURE,
  LIKE_POSTS_REQUEST,
  LIKE_POSTS_SUCCESS,
} from "./post.action.Type";

export const createPostAction = (postData) => async (dispatch) => {
  dispatch({ type: CREATE_POSTS_REQUEST });
  try {
    const { data } = await api.post("/api/posts", postData);
    dispatch({ type: CREATE_POSTS_SUCCESS, payload: data });
    console.log("Create Post Action: ", data);
  } catch (error) {
    dispatch({ type: CREATE_POSTS_FAILURE, payload: error });
    console.log("Create Post Action Error: ", error);
  }
};

export const getAllPostAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_POSTS_REQUEST });
  try {
    const { data } = await api.get("/api/posts");
    dispatch({ type: GET_ALL_POSTS_SUCCESS, payload: data });
    console.log("Get all Post Action: ", data);
  } catch (error) {
    dispatch({ type: GET_ALL_POSTS_FAILURE, payload: error });
    console.log("Get Post Action Error: ", error);
  }
};

export const getUsersPostAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_USERS_POSTS_REQUEST });
  try {
    const { data } = await api.get(`/api/posts/user/${userId}`);
    dispatch({ type: GET_USERS_POSTS_SUCCESS, payload: data });
    console.log("Get user Post Action: ", data);
  } catch (error) {
    dispatch({ type: GET_USERS_POSTS_FAILURE, payload: error });
    console.log("Get user Posts Action Error: ", error);
  }
};

export const likePostAction = (postId) => async (dispatch) => {
  dispatch({ type: LIKE_POSTS_REQUEST });
  try {
    const { data } = await api.put(`/api/posts/like/${postId}`);

    console.log("Like post response:", data);

    dispatch({ type: LIKE_POSTS_SUCCESS, payload: data });
  } catch (error) {
    console.error("Like post error:", error);
    dispatch({ type: LIKE_POSTS_FAILURE, payload: error });
  }
};

// CREATE COMMENT
export const createCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_COMMENT_REQUEST });
  try {
    const { data } = await api.post(
      `/api/comments/post/${reqData.postId}`,
      reqData.data
    );

    // Make sure the postId is included in the payload
    dispatch({
      type: CREATE_COMMENT_SUCCESS,
      payload: {
        ...data,
        postId: reqData.postId,
      },
    });
  } catch (error) {
    dispatch({ type: CREATE_COMMENT_FAILURE, payload: error });
  }
};
