package com.dosemate.websocket;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;

public class ReminderWebSocketHandler extends TextWebSocketHandler {

    private static final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("WebSocket connected. Total sessions: " + sessions.size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages from client (if needed)
        String payload = message.getPayload();
        System.out.println("Received message: " + payload);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("WebSocket disconnected. Total sessions: " + sessions.size());
    }

    // Broadcast reminder event to all connected clients
    public static void broadcastReminder(Map<String, Object> reminderEvent) throws IOException {
        TextMessage message = new TextMessage(new ObjectMapper().writeValueAsString(reminderEvent));
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(message);
                } catch (IOException e) {
                    System.err.println("Error sending message to session: " + e.getMessage());
                }
            }
        }
    }

    // Broadcast adherence stats update
    public static void broadcastAdherence(Map<String, Object> adherenceData) throws IOException {
        TextMessage message = new TextMessage(new ObjectMapper().writeValueAsString(adherenceData));
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(message);
                } catch (IOException e) {
                    System.err.println("Error sending adherence update: " + e.getMessage());
                }
            }
        }
    }
}
