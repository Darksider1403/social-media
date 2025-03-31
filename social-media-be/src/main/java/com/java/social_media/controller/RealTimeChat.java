//package com.java.social_media.controller;
//
//
//import com.java.social_media.models.Message;
//import com.java.social_media.models.User;
//import com.java.social_media.service.ChatService;
//import com.java.social_media.service.MessageService;
//import com.java.social_media.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.DestinationVariable;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//@Controller
//public class RealTimeChat {
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//
//    @Autowired
//    private MessageService messageService;
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private ChatService chatService;
//
//    @MessageMapping("/chat/{chatId}")
//    public Message sendToUser(@Payload Message message,
//                              @DestinationVariable String chatId,
//                              SimpMessageHeaderAccessor headerAccessor) {
//
//        System.out.println("Received WebSocket message for chat: " + chatId);
//        System.out.println("Message content: " + message.getContent());
//
//        // Get the JWT token from headers to identify the user
//        String token = headerAccessor.getFirstNativeHeader("Authorization");
//        if (token != null && token.startsWith("Bearer ")) {
//            token = token.substring(7);
//        }
//
//        try {
//            // Find user and save message to database
//            User user = userService.findUserByJwt(token);
//            System.out.println("User found: " + user.getFirstName() + " " + user.getLastName());
//
//            // Use your existing message service to save the message
//            Message savedMessage = messageService.createMessage(user, Integer.parseInt(chatId), message);
//            System.out.println("Message saved with ID: " + savedMessage.getId());
//
//            // Send to all subscribers of this chat
//            messagingTemplate.convertAndSendToUser(chatId, "/private", savedMessage);
//
//            return savedMessage;
//        } catch (Exception e) {
//            System.err.println("Error processing WebSocket message:");
//            e.printStackTrace();
//            return message;
//        }
//    }
//}
