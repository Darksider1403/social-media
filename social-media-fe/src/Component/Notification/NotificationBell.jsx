import React, { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../redux/Notification/notification.action";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../../utils/dateUtils";

const NotificationBell = ({ showDropdown = true, iconOnly = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications = [], unreadCount = 0 } = useSelector(
    (state) => state.notification || { notifications: [], unreadCount: 0 }
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch notifications when component mounts
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleClick = (event) => {
    if (iconOnly) {
      // If in icon-only mode, just navigate to notifications page
      navigate("/home/notifications");
    } else if (showDropdown) {
      // Otherwise show dropdown if enabled
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    // Navigate to the post when notification is clicked
    if (notification.referenceType === "POST" && notification.referenceId) {
      navigate(`/post/${notification.referenceId}`);
    }
    handleClose();
  };

  // If in icon-only mode, just return the badge
  if (iconOnly) {
    return (
      <Badge badgeContent={unreadCount} color="error">
        <NotificationsIcon onClick={handleClick} />
      </Badge>
    );
  }

  // Otherwise return the full notification bell with dropdown
  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {showDropdown && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 400,
              width: 320,
            },
          }}
        >
          <div className="px-3 py-2 flex justify-between items-center">
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
          </div>
          <Divider />

          {notifications.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2">No notifications yet</Typography>
            </MenuItem>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{ whiteSpace: "normal", py: 1 }}
              >
                <div className="flex items-start gap-2 w-full">
                  <div className="flex-shrink-0">
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {notification.content.charAt(0)}
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <Typography variant="body2" className="font-medium">
                      {notification.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(notification.createdAt)}
                    </Typography>
                  </div>
                </div>
              </MenuItem>
            ))
          )}

          {notifications.length > 0 && (
            <>
              <Divider />
              <MenuItem
                onClick={() => {
                  navigate("/home/notifications");
                  handleClose();
                }}
              >
                <Typography color="primary">See all notifications</Typography>
              </MenuItem>
            </>
          )}
        </Menu>
      )}
    </>
  );
};

export default NotificationBell;
