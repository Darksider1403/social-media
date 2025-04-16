package com.java.social_media.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Configuration
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
        System.out.println("WebSocket endpoints registered");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic", "/queue", "/user", "/chat", "/notifications");
        registry.setUserDestinationPrefix("/user");
    }

    // Add a WebSocket event listener
    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        System.out.println("New WebSocket session connected: " + event.getMessage());
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        System.out.println("WebSocket session disconnected: " + event.getSessionId());
    }
}
