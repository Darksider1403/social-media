import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  ADD_NOTIFICATION,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
} from "./notification.actionType";
import { api } from "../../config/api";

export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
    const { data } = await api.get("/api/notifications");
    dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_NOTIFICATIONS_FAILURE,
      payload: error.response?.data?.message || "Error fetching notifications",
    });
    throw error;
  }
};

export const addNotification = (notification) => ({
  type: ADD_NOTIFICATION,
  payload: notification,
});

export const markNotificationRead = (notificationId) => async (dispatch) => {
  try {
    const { data } = await api.put(`/api/notifications/${notificationId}/read`);
    dispatch({ type: MARK_NOTIFICATION_READ, payload: notificationId });
    return data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsRead = () => async (dispatch) => {
  try {
    await api.put("/api/notifications/read-all");
    dispatch({ type: MARK_ALL_NOTIFICATIONS_READ });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};
