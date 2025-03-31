package com.java.social_media.service.impl;

import com.java.social_media.models.Chat;
import com.java.social_media.models.User;
import com.java.social_media.repository.ChatRepository;
import com.java.social_media.service.ChatService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ChatServiceImplementation implements ChatService {
    private ChatRepository chatRepository;

    @Override
    public Chat createChat(User reqUser, User targetUser) {
        // First check if a chat already exists between these users
        Chat existingChat = chatRepository.findChatByUsersId(targetUser, reqUser);

        if (existingChat != null) {
            return existingChat;
        }

        // Create a new chat
        Chat newChat = new Chat();
        newChat.getUsers().add(targetUser);
        newChat.getUsers().add(reqUser);
        newChat.setTimestamp(LocalDateTime.now());

        if (newChat.getUuid() == null) {
            newChat.setUuid(UUID.randomUUID().toString());
        }

        return chatRepository.save(newChat);
    }

    @Override
    public Chat findChatById(Integer chatId) throws Exception {
        Optional<Chat> chat = chatRepository.findById(chatId);

        if (chat.isEmpty()) {
            throw new Exception("Chat not found with id: " + chatId);
        }

        return chat.get();
    }

    @Override
    public Chat findChatByUuid(String uuid) throws Exception {
        Optional<Chat> chat = chatRepository.findByUuid(uuid);

        if (chat.isEmpty()) {
            throw new Exception("Chat not found with uuid: " + uuid);
        }

        return chat.get();
    }

    @Override
    public List<Chat> findUsersChats(Integer userId) {
        return chatRepository.findByUsersId(userId);
    }

    @Override
    public Chat createChatWithUuid(User reqUser, User targetUser) {
        return createChat(reqUser, targetUser);
    }

    @Override
    public List<Chat> findUsersChatsByUserUuid(String userUuid) {
        return chatRepository.findByUserUuid(userUuid);
    }
}