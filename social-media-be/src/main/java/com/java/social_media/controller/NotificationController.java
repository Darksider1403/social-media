package com.java.social_media.controller;

import com.java.social_media.models.Notification;
import com.java.social_media.models.User;
import com.java.social_media.service.NotificationService;
import com.java.social_media.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping("/api/notifications")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @RequestHeader("Authorization") String token) {
        User user = userService.findUserByJwt(token);
        List<Notification> notifications = notificationService.getUserNotifications(user.getId());

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/api/notifications/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @RequestHeader("Authorization") String token) {
        User user = userService.findUserByJwt(token);
        List<Notification> notifications = notificationService.getUnreadNotifications(user.getId());

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/api/notifications/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadNotificationsCount(
            @RequestHeader("Authorization") String token) {
        User user = userService.findUserByJwt(token);
        long count = notificationService.getUnreadNotifications(user.getId()).size();

        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/api/notifications/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Integer notificationId,
            @RequestHeader("Authorization") String token) {
        User user = userService.findUserByJwt(token);
        Notification notification = notificationService.markAsRead(notificationId);

        return ResponseEntity.ok(notification);
    }

    @PutMapping("/api/notifications/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @RequestHeader("Authorization") String token) {
        User user = userService.findUserByJwt(token);
        notificationService.markAllAsRead(user.getId());

        return ResponseEntity.ok().build();
    }
}
