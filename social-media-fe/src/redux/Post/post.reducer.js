import {
  CREATE_POSTS_FAILURE,
  CREATE_POSTS_REQUEST,
  CREATE_POSTS_SUCCESS,
  GET_ALL_POSTS_FAILURE,
  GET_ALL_POSTS_REQUEST,
  GET_ALL_POSTS_SUCCESS,
  LIKE_POSTS_FAILURE,
  LIKE_POSTS_REQUEST,
  LIKE_POSTS_SUCCESS,
  CREATE_COMMENT_SUCCESS,
  GET_USERS_POSTS_REQUEST,
  GET_USERS_POSTS_SUCCESS,
  GET_USERS_POSTS_FAILURE,
} from "./post.action.Type";

const initialState = {
  post: null,
  loading: false,
  error: null,
  posts: [],
  like: null,
  comments: [],
};
export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_POSTS_REQUEST:
    case GET_ALL_POSTS_REQUEST:
    case LIKE_POSTS_REQUEST:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case CREATE_POSTS_SUCCESS:
      return {
        ...state,
        post: action.payload,
        posts: [action.payload, ...state.posts],
        loading: false,
        error: null,
      };

    case GET_ALL_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.payload,
        comments: action.payload.comments,
        loading: false,
        error: null,
      };

    case LIKE_POSTS_SUCCESS:
      console.log("LIKE_POSTS_SUCCESS payload:", action.payload);
      console.log("Current posts:", state.posts);

      return {
        ...state,
        like: action.payload,
        loading: false,
        posts: state.posts.map((item) => {
          console.log(
            `Comparing item.id: ${item.id} with payload.id: ${action.payload.id}`
          );
          return item.id === action.payload.id ? action.payload : item;
        }),
        error: null,
      };

    case CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            return {
              ...post,
              comments: [...(post.comments || []), action.payload],
            };
          }

          return post;
        }),
        loading: false,
        error: null,
      };
    case CREATE_POSTS_FAILURE:
    case GET_ALL_POSTS_FAILURE:
    case LIKE_POSTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case GET_USERS_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_USERS_POSTS_SUCCESS:
      return {
        ...state,
        userPosts: action.payload,
        loading: false,
        error: null,
      };

    case GET_USERS_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
