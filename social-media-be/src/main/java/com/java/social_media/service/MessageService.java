package com.java.social_media.service;

import com.java.social_media.models.Message;
import com.java.social_media.models.User;

import java.util.List;

public interface MessageService {
    Message createMessage(User user, Integer chatId, Message req) throws Exception;
    List<Message> findChatsMessages(Integer chatId);
}
