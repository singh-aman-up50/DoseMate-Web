package com.dosemate.service;

import com.dosemate.model.History;
import com.dosemate.model.Reminder;
import com.dosemate.model.ReminderStatus;
import com.dosemate.model.User;
import com.dosemate.repository.HistoryRepository;
import com.dosemate.repository.ReminderRepository;
import com.dosemate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private final HistoryRepository historyRepository;
    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    public HistoryService(HistoryRepository historyRepository, ReminderRepository reminderRepository, UserRepository userRepository) {
        this.historyRepository = historyRepository;
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public History recordHistory(Long reminderId, ReminderStatus status, String source, String notes) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found"));

        Instant now = Instant.now();
        Long latency = null;
        try {
            if (reminder.getScheduledAt() != null) {
                latency = Duration.between(reminder.getScheduledAt().toInstant(java.time.ZoneOffset.UTC), now).getSeconds();
            }
        } catch (Exception ignored) {}

        History h = new History(null, reminder, status, now, source, latency, notes);
        History saved = historyRepository.save(h);
        
        // Broadcast event via WebSocket
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("type", "INTAKE_RECORDED");
            event.put("reminderId", reminderId);
            event.put("medicineId", reminder.getMedicine().getId());
            event.put("medicineName", reminder.getMedicine().getName());
            event.put("status", status);
            event.put("timestamp", now);
            event.put("latencySeconds", latency);
            com.dosemate.websocket.ReminderWebSocketHandler.broadcastAdherence(event);
        } catch (Exception e) {
            System.err.println("Failed to broadcast WebSocket event: " + e.getMessage());
        }
        
        return saved;
    }

    public List<History> getUserHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return historyRepository.findAll().stream()
                .filter(h -> h.getReminder() != null && h.getReminder().getMedicine() != null &&
                        h.getReminder().getMedicine().getUser() != null &&
                        h.getReminder().getMedicine().getUser().getId().equals(user.getId()))
                .sorted(Comparator.comparing(History::getRecordedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<History> getUserHistoryByDateRange(String userEmail, LocalDateTime startDate, LocalDateTime endDate) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Instant startInstant = startDate.atZone(java.time.ZoneId.systemDefault()).toInstant();
        Instant endInstant = endDate.atZone(java.time.ZoneId.systemDefault()).toInstant();
        
        return historyRepository.findAll().stream()
                .filter(h -> h.getReminder() != null && h.getReminder().getMedicine() != null &&
                        h.getReminder().getMedicine().getUser().getId().equals(user.getId()) &&
                        h.getRecordedAt().isAfter(startInstant) &&
                        h.getRecordedAt().isBefore(endInstant))
                .sorted(Comparator.comparing(History::getRecordedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<History> getHistoryByMedicine(Long medicineId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return historyRepository.findAll().stream()
                .filter(h -> h.getReminder() != null && h.getReminder().getMedicine() != null &&
                        h.getReminder().getMedicine().getId().equals(medicineId) &&
                        h.getReminder().getMedicine().getUser().getId().equals(user.getId()))
                .sorted(Comparator.comparing(History::getRecordedAt).reversed())
                .collect(Collectors.toList());
    }

    public Map<String, Object> getAdherenceStats(String userEmail) {
        List<History> history = getUserHistory(userEmail);
        
        long totalReminders = history.size();
        long takenCount = history.stream().filter(h -> h.getStatus() == ReminderStatus.TAKEN).count();
        long missedCount = history.stream().filter(h -> h.getStatus() == ReminderStatus.MISSED).count();
        
        double adherenceRate = totalReminders > 0 ? (takenCount * 100.0 / totalReminders) : 0;
        double avgLatency = history.stream()
                .filter(h -> h.getLatencySeconds() != null && h.getStatus() == ReminderStatus.TAKEN)
                .mapToLong(History::getLatencySeconds)
                .average()
                .orElse(0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReminders", totalReminders);
        stats.put("taken", takenCount);
        stats.put("missed", missedCount);
        stats.put("adherenceRate", String.format("%.2f", adherenceRate) + "%");
        stats.put("averageLatencySeconds", avgLatency);
        
        return stats;
    }

    public Map<String, Object> getAdherenceStatsByMedicine(Long medicineId, String userEmail) {
        List<History> medicineHistory = getHistoryByMedicine(medicineId, userEmail);
        
        long totalReminders = medicineHistory.size();
        long takenCount = medicineHistory.stream().filter(h -> h.getStatus() == ReminderStatus.TAKEN).count();
        long missedCount = medicineHistory.stream().filter(h -> h.getStatus() == ReminderStatus.MISSED).count();
        
        double adherenceRate = totalReminders > 0 ? (takenCount * 100.0 / totalReminders) : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("medicineId", medicineId);
        stats.put("totalReminders", totalReminders);
        stats.put("taken", takenCount);
        stats.put("missed", missedCount);
        stats.put("adherenceRate", String.format("%.2f", adherenceRate) + "%");
        
        return stats;
    }

    public List<Map<String, Object>> getWeeklyAdherence(String userEmail) {
        List<History> history = getUserHistory(userEmail);
        List<Map<String, Object>> weeklyData = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            Instant dayStart = date.atStartOfDay(java.time.ZoneId.systemDefault()).toInstant();
            Instant dayEnd = date.plusDays(1).atStartOfDay(java.time.ZoneId.systemDefault()).toInstant();

            long dayCount = history.stream()
                    .filter(h -> h.getRecordedAt().isAfter(dayStart) && h.getRecordedAt().isBefore(dayEnd))
                    .count();
            long takenCount = history.stream()
                    .filter(h -> h.getRecordedAt().isAfter(dayStart) && h.getRecordedAt().isBefore(dayEnd)
                            && h.getStatus() == ReminderStatus.TAKEN)
                    .count();

            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date);
            dayData.put("total", dayCount);
            dayData.put("taken", takenCount);
            dayData.put("percentage", dayCount > 0 ? (takenCount * 100 / dayCount) : 0);
            weeklyData.add(dayData);
        }

        return weeklyData;
    }
}
