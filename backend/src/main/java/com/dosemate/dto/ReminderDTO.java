package com.dosemate.dto;

import com.dosemate.model.Reminder;
import com.dosemate.model.ReminderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReminderDTO {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private LocalDateTime scheduledAt;
    private ReminderStatus status;
    private String repeatPattern; // daily, weekly, monthly, custom
    private String zoneId; // timezone
    private String deliveryChannel; // app, email, sms, push
    private Integer snoozeCount; // number of times snoozed
    private LocalDateTime snoozedUntil; // snooze expiry time

    public static ReminderDTO fromEntity(Reminder reminder) {
        ReminderDTO dto = new ReminderDTO();
        dto.setId(reminder.getId());
        dto.setMedicineId(reminder.getMedicine().getId());
        dto.setMedicineName(reminder.getMedicine().getName());
        dto.setScheduledAt(reminder.getScheduledAt());
        dto.setStatus(reminder.getStatus());
        dto.setRepeatPattern(reminder.getRepeatPattern());
        dto.setZoneId(reminder.getZoneId());
        dto.setDeliveryChannel(reminder.getDeliveryChannel());
        dto.setSnoozeCount(reminder.getSnoozeCount());
        return dto;
    }
}
