package com.java.social_media.controller;

import com.java.social_media.models.Chat;
import com.java.social_media.models.User;
import com.java.social_media.request.CreateChatRequest;
import com.java.social_media.service.ChatService;
import com.java.social_media.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class ChatController {
    private ChatService chatService;

    private UserService userService;

    @PostMapping("/api/chats")
    public Chat createChat(@RequestBody Map<String, Integer> request,
                           @RequestHeader("Authorization") String jwt) throws Exception {

        // Extract userId from request
        Integer userId = request.get("userId");

        if (userId == null) {
            throw new IllegalArgumentException("userId is required");
        }

        User reqUser = userService.findUserByJwt(jwt);
        User targetUser = userService.findUserById(userId);

        Chat chat = chatService.createChat(reqUser, targetUser);

        return chat;
    }

    @PostMapping("/api/v2/chats")
    public Chat createChatWithUuid(@RequestHeader("Authorization") String jwt,
                                   @RequestBody CreateChatRequestV2 req) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        User targetUser = userService.findUserByUuid(req.getTargetUserUuid());

        Chat chat = chatService.createChat(reqUser, targetUser);
        return chat;
    }

    @GetMapping("/api/chats")
    public List<Chat> findUsersChat(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserByJwt(jwt);
        List<Chat> chats = chatService.findUsersChats(user.getId());

        return chats;
    }

    @GetMapping("/api/v2/chats")
    public List<Chat> findUsersChatByUuid(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserByJwt(jwt);
        List<Chat> chats = chatService.findUsersChatsByUserUuid(user.getUuid());
        return chats;
    }

    @GetMapping("/api/v2/chats/{uuid}")
    public Chat findChatByUuid(@PathVariable("uuid") String uuid) throws Exception {
        return chatService.findChatByUuid(uuid);
    }

    @GetMapping("/api/chats/{chatId}")
    public Chat findChatById(@PathVariable Integer chatId,
                             @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwt(jwt);
        Chat chat = chatService.findChatById(chatId);

        return chat;
    }
}

class CreateChatRequestV2 {
    private String targetUserUuid;

    // Getters and setters
    public String getTargetUserUuid() {
        return targetUserUuid;
    }

    public void setTargetUserUuid(String targetUserUuid) {
        this.targetUserUuid = targetUserUuid;
    }
}
