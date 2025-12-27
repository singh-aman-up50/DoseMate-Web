package com.dosemate.service;

import com.dosemate.model.Reminder;
import com.dosemate.model.ReminderStatus;
import com.dosemate.repository.ReminderRepository;
import com.dosemate.websocket.ReminderWebSocketHandler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReminderDispatcherService {

    private final ReminderRepository reminderRepository;

    public ReminderDispatcherService(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    // Runs every 30 seconds and dispatches due reminders persisted in DB.
    @Scheduled(fixedRate = 30000)
    @Transactional
    public void dispatchDueReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> due = reminderRepository.findByScheduledAtBeforeAndStatus(now.plusSeconds(1), ReminderStatus.PENDING);
        if (due.isEmpty()) return;

        for (Reminder r : due) {
            try {
                Map<String, Object> event = new HashMap<>();
                event.put("reminderId", r.getId());
                if (r.getMedicine() != null) {
                    event.put("medicineId", r.getMedicine().getId());
                    event.put("medicineName", r.getMedicine().getName());
                    event.put("dosage", r.getMedicine().getDosage());
                    event.put("unit", r.getMedicine().getUnit());
                }
                event.put("scheduledAt", r.getScheduledAt() != null ? r.getScheduledAt().toString() : null);
                ReminderWebSocketHandler.broadcastReminder(event);
                // mark as TRIGGERED so we do not repeatedly notify
                r.setStatus(ReminderStatus.TRIGGERED);
                try {
                    reminderRepository.save(r);
                } catch (DataIntegrityViolationException dive) {
                    // Some DB schemas may not include TRIGGERED in allowed values (check constraint).
                    // Log and continue without failing the scheduled task.
                    System.err.println("Warning: could not persist TRIGGERED status for reminder " + r.getId() + ": " + dive.getMessage());
                    // fallback: do not change persistent status to avoid constraint; continue dispatching
                }
            } catch (IOException e) {
                System.err.println("Failed to broadcast reminder " + r.getId() + ": " + e.getMessage());
            } catch (Exception e) {
                System.err.println("Unexpected error dispatching reminder " + r.getId() + ": " + e.getMessage());
            }
        }
    }
}
