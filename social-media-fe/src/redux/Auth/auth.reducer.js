import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  SEARCH_USER_SUCCESS,
  GET_PROFILE_BY_USERNAME_REQUEST,
  GET_PROFILE_BY_USERNAME_SUCCESS,
  GET_PROFILE_BY_USERNAME_FAILURE,
  LOGOUT,
} from "./auth.actiontype";

const initialState = {
  user: null, // Current logged-in user
  profileUser: null, // User whose profile is being viewed
  token: null,
  loading: false,
  error: null,
  searchUser: [],
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case REGISTER_REQUEST:
    case GET_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.payload,
        token: localStorage.getItem("jwt"),
        error: null,
        loading: false,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };

    case REGISTER_SUCCESS:
      return { ...state, jwt: action.payload, loading: false, error: null };

    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case REGISTER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        // If the profile being viewed is the user's own profile, update it too
        profileUser:
          state.profileUser?.id === action.payload.id
            ? action.payload
            : state.profileUser,
        error: null,
      };

    case SEARCH_USER_SUCCESS:
      return {
        ...state,
        searchUser: action.payload,
        error: null,
        loading: false,
      };

    case GET_PROFILE_BY_USERNAME_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_PROFILE_BY_USERNAME_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        // Store the viewed profile separately, don't overwrite the user
        profileUser: action.payload,
      };

    case GET_PROFILE_BY_USERNAME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      return {
        ...state,
        user: null,
        profileUser: null,
        token: null,
        loading: false,
        error: null,
        searchUser: [],
      };
    default:
      return state;
  }
};
