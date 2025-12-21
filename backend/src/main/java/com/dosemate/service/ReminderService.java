package com.dosemate.service;

import com.dosemate.dto.ReminderDTO;
import com.dosemate.model.*;
import com.dosemate.repository.HistoryRepository;
import com.dosemate.repository.MedicineRepository;
import com.dosemate.repository.ReminderRepository;
import com.dosemate.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final MedicineRepository medicineRepository;
    private final HistoryRepository historyRepository;
    private final UserRepository userRepository;

    public ReminderService(ReminderRepository reminderRepository, MedicineRepository medicineRepository, HistoryRepository historyRepository, UserRepository userRepository) {
        this.reminderRepository = reminderRepository;
        this.medicineRepository = medicineRepository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    // Runs every minute and creates reminders for medicines based on simple schedule logic.
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkAndCreateReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowEnd = now.plusMinutes(5);

        List<Medicine> medicines = medicineRepository.findAll();
        List<Reminder> toSave = new ArrayList<>();

        for (Medicine m : medicines) {
            if (!m.isActive()) continue;
            // naive: create reminders for today's reminderTimes if within next 5 minutes
            for (String time : m.getReminderTimes()) {
                String[] parts = time.split(":");
                if (parts.length < 2) continue;
                LocalDateTime scheduled = LocalDateTime.now().withHour(Integer.parseInt(parts[0])).withMinute(Integer.parseInt(parts[1])).withSecond(0).withNano(0);
                if (scheduled.isAfter(now) && !scheduled.isAfter(windowEnd)) {
                    Reminder r = new Reminder();
                    r.setMedicine(m);
                    r.setScheduledAt(scheduled);
                    r.setStatus(ReminderStatus.PENDING);
                    r.setDeliveryChannel("app");
                    r.setZoneId(ZoneId.systemDefault().getId());
                    toSave.add(r);
                }
            }
        }
        if (!toSave.isEmpty()) reminderRepository.saveAll(toSave);

        // Mark overdue reminders as MISSED
        List<Reminder> pending = reminderRepository.findByStatus(ReminderStatus.PENDING);
        for (Reminder r : pending) {
                if (r.getScheduledAt().isBefore(LocalDateTime.now().minusMinutes(30))) {
                    r.setStatus(ReminderStatus.MISSED);
                    historyRepository.save(new History(null, r, ReminderStatus.MISSED, java.time.Instant.now(), "AUTO", null, null));
                    reminderRepository.save(r);
                }
        }
    }

    @Transactional
    public ReminderDTO createReminder(ReminderDTO dto, Long medicineId, String userEmail) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!medicine.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized");
        }

        Reminder reminder = new Reminder();
        reminder.setMedicine(medicine);
        reminder.setScheduledAt(dto.getScheduledAt());
        reminder.setStatus(ReminderStatus.PENDING);
        reminder.setRepeatPattern(dto.getRepeatPattern() != null ? dto.getRepeatPattern() : "daily");
        reminder.setZoneId(dto.getZoneId() != null ? dto.getZoneId() : ZoneId.systemDefault().getId());
        reminder.setDeliveryChannel(dto.getDeliveryChannel() != null ? dto.getDeliveryChannel() : "app");
        reminder.setSnoozeCount(0);

        return ReminderDTO.fromEntity(reminderRepository.save(reminder));
    }

    public List<ReminderDTO> getRemindersByMedicine(Long medicineId, String userEmail) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!medicine.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized");
        }

        return reminderRepository.findByMedicine(medicine).stream()
                .map(ReminderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ReminderDTO> getPendingReminders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return reminderRepository.findByStatus(ReminderStatus.PENDING).stream()
                .filter(r -> r.getMedicine().getUser().getId().equals(user.getId()))
                .map(ReminderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReminderDTO updateReminderStatus(Long reminderId, String status, String userEmail) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!reminder.getMedicine().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized");
        }

        ReminderStatus newStatus = ReminderStatus.valueOf(status);
        reminder.setStatus(newStatus);
        reminderRepository.save(reminder);
        
        historyRepository.save(new History(null, reminder, newStatus, java.time.Instant.now(), "MANUAL", null, null));
        
        return ReminderDTO.fromEntity(reminder);
    }

    @Transactional
    public ReminderDTO snoozeReminder(Long reminderId, Integer minutes, String userEmail) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!reminder.getMedicine().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized");
        }

        reminder.setSnoozeCount((reminder.getSnoozeCount() != null ? reminder.getSnoozeCount() : 0) + 1);
        reminder.setScheduledAt(reminder.getScheduledAt().plusMinutes(minutes));
        
        return ReminderDTO.fromEntity(reminderRepository.save(reminder));
    }

    public List<ReminderDTO> getUpcomingReminders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        LocalDateTime now = LocalDateTime.now();
        return reminderRepository.findByStatus(ReminderStatus.PENDING).stream()
                .filter(r -> r.getMedicine().getUser().getId().equals(user.getId()))
                .filter(r -> r.getScheduledAt().isAfter(now) && r.getScheduledAt().isBefore(now.plusHours(24)))
                .map(ReminderDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
