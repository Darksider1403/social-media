package com.java.social_media.controller;

import com.java.social_media.models.Comment;
import com.java.social_media.models.Notification;
import com.java.social_media.models.Post;
import com.java.social_media.models.User;
import com.java.social_media.repository.NotificationRepository;
import com.java.social_media.service.CommentService;
import com.java.social_media.service.PostService;
import com.java.social_media.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final UserService userService;
    private final PostService postService;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/api/comments/post/{postId}")
    public Comment createComment(@RequestBody Comment comment,
                                 @RequestHeader("Authorization") String jwt,
                                 @PathVariable Integer postId) throws Exception {
        User user = userService.findUserByJwt(jwt);
        Comment createdComment = commentService.createComment(comment, postId, user.getId());

        // After creating the comment, generate a notification
        try {
            Post post = postService.findPostById(postId);

            // Only create notification if commenter is not the post owner
            if (post != null && post.getUser() != null && !post.getUser().getId().equals(user.getId())) {
                Notification notification = new Notification();
                notification.setUser(post.getUser());
                notification.setType("COMMENT");
                notification.setContent(user.getFirstName() + " " + user.getLastName() + " commented on your post");
                notification.setReferenceId(postId);
                notification.setReferenceType("POST");
                notification.setRead(false);
                notification.setCreatedAt(java.time.LocalDateTime.now());

                // Save notification
                Notification savedNotification = notificationRepository.save(notification);

                // Send real-time notification via WebSocket
                messagingTemplate.convertAndSendToUser(
                        post.getUser().getId().toString(),
                        "/queue/notifications",
                        savedNotification
                );

                System.out.println("Comment notification sent to user: " + post.getUser().getId());
            }
        } catch (Exception e) {
            // Log error but don't fail the comment creation
            System.err.println("Error creating notification: " + e.getMessage());
        }

        return createdComment;
    }

    @PutMapping("/api/comments/like/{commentId}")
    public Comment likeComment(@RequestHeader("Authorization") String jwt,
                               @PathVariable Integer commentId) throws Exception {
        User user = userService.findUserByJwt(jwt);
        Comment likedComment = commentService.likeComment(commentId, user.getId());

        return likedComment;
    }
}
