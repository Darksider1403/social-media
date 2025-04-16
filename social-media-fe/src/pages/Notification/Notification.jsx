import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAllNotificationsRead,
} from "../../redux/Notification/notification.action";
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { formatRelativeTime } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications = [], loading = false } = useSelector(
    (state) => state.notification || { notifications: [], loading: false }
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handleNotificationClick = (notification) => {
    if (notification.referenceType === "POST" && notification.referenceId) {
      navigate(`/post/${notification.referenceId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" component="h1">
          Notifications
        </Typography>
        {notifications.length > 0 && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleMarkAllRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <Typography variant="body1" color="textSecondary">
            You don't have any notifications yet.
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mt-2">
            When you get notifications, they'll appear here.
          </Typography>
        </div>
      ) : (
        <List>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem
                alignItems="flex-start"
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  bgcolor: notification.read
                    ? "transparent"
                    : "rgba(25, 118, 210, 0.08)",
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar>{notification.content.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.content}
                  secondary={
                    <React.Fragment>
                      {notification.type && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="primary"
                          mr={1}
                        >
                          {notification.type}
                        </Typography>
                      )}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {formatRelativeTime(notification.createdAt)}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </div>
  );
};

export default Notification;
