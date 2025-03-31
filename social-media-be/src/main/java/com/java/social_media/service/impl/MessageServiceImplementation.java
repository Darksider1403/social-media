package com.java.social_media.service.impl;

import com.java.social_media.models.Chat;
import com.java.social_media.models.Message;
import com.java.social_media.models.User;
import com.java.social_media.repository.ChatRepository;
import com.java.social_media.repository.MessageRepository;
import com.java.social_media.service.ChatService;
import com.java.social_media.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class MessageServiceImplementation implements MessageService {
    private MessageRepository messageRepository;
    private ChatService chatService;
    private ChatRepository chatRepository;

    @Override
    public Message createMessage(User user, Integer chatId, Message req) throws Exception {
        Chat chat = chatService.findChatById(chatId);

        Message message = new Message();
        message.setChat(chat);
        message.setContent(req.getContent());
        message.setImage(req.getImage());
        message.setUser(user);
        message.setTimestamp(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);
        chat.getMessages().add(savedMessage);
        chatRepository.save(chat);

        return savedMessage;
    }

    @Override
    public List<Message> findChatsMessages(Integer chatId) {
        return messageRepository.findByChatId(chatId);
    }
}
