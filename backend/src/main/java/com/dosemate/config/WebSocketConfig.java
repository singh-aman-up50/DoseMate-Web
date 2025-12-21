package com.dosemate.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.dosemate.websocket.ReminderWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new ReminderWebSocketHandler(), "/ws/reminders")
                .setAllowedOrigins("*");
        registry.addHandler(new ReminderWebSocketHandler(), "/ws/adherence")
                .setAllowedOrigins("*");
    }
}
