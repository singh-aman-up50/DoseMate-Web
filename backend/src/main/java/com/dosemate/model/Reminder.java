package com.dosemate.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    private LocalDateTime scheduledAt;

    private String zoneId; // timezone id for scheduling

    private String repeatPattern; // cron or rrule representation for complex schedules

    @Enumerated(EnumType.STRING)
    private ReminderStatus status = ReminderStatus.PENDING;

    private String deliveryChannel; // PUSH, EMAIL, SMS, LOCAL

    private Integer snoozeCount = 0;

    private Instant createdAt = Instant.now();
}
