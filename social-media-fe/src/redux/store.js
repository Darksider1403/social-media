import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/auth.reducer";
import { postReducer } from "./Post/post.reducer";
import { messageReducer } from "./Message/message.reducer";
import { storyReducer } from "./Story/story.reducer";
import { reelsReducer } from "./Reels/reels.reducer";
import { notificationReducer } from "./Notification/notification.reducer";

const rootReducers = combineReducers({
  auth: authReducer,
  post: postReducer,
  notification: notificationReducer,
  message: messageReducer,
  story: storyReducer,
  reels: reelsReducer,
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
