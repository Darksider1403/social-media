import axios from "axios";
import { api, API_BASE_URL } from "../../config/api";
import {
  GET_PROFILE_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  SEARCH_USER_FAILURE,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from "./auth.actiontype";

export const loginUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/signin`,
      loginData.data
    );

    const token = response.data.token || response.data.jwt;

    if (token) {
      localStorage.setItem("jwt", token);
      dispatch({ type: LOGIN_SUCCESS, payload: { token } });

      // Get user profile after successful login
      dispatch(getProfileAction(token));
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || "Login failed",
    });
  }
};

export const registerUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/signup`,
      loginData.data
    );

    if (data.token) {
      localStorage.setItem("jwt", data.token);
    }

    console.log("---------register", data);

    dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
  } catch (error) {
    console.log("-------------", error);
    dispatch({ type: REGISTER_FAILURE, payload: error });
  }
};

export const getProfileAction = (token) => async (dispatch) => {
  if (!token) return;

  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: GET_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    localStorage.removeItem("jwt");
    dispatch({ type: GET_PROFILE_FAILURE });
  }
};

export const updateProfileAction = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/users`, reqData);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });

    // After successful update, fetch the updated profile
    dispatch(getProfileAction(localStorage.getItem("jwt")));
  } catch (error) {
    console.error("Update profile error:", error);
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
  }
};

export const searchUser = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const { data } = await api.get(`/api/users/search?query=${query}`);

    dispatch({ type: SEARCH_USER_SUCCESS, payload: data });
    console.log("Search user action:", data);
  } catch (error) {
    dispatch({ type: SEARCH_USER_FAILURE });
    console.error("Search user action error:", error);
  }
};
