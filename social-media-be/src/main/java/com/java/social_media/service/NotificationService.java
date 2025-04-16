package com.java.social_media.service;

import com.java.social_media.models.Notification;
import com.java.social_media.models.User;

import java.util.List;

public interface NotificationService {
    Notification createNotification(User user, String type, String content, Integer referenceId, String referenceType);
    List<Notification> getUserNotifications(Integer userId);
    List<Notification> getUnreadNotifications(Integer userId);
    Notification markAsRead(Integer notificationId);
    void markAllAsRead(Integer userId);
}
