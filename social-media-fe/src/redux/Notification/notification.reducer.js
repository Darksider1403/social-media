import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  ADD_NOTIFICATION,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
} from "./notification.actionType";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

export const notificationReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: payload,
        unreadCount: payload.filter((notification) => !notification.read)
          .length,
      };

    case FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case ADD_NOTIFICATION:
      // Add new notification to the beginning of the array
      return {
        ...state,
        notifications: [payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };

    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case MARK_ALL_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
        unreadCount: 0,
      };

    default:
      return state;
  }
};
