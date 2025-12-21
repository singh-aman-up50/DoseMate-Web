package com.dosemate.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reminder_id")
    private Reminder reminder;

    @Enumerated(EnumType.STRING)
    private ReminderStatus status;

    private Instant recordedAt = Instant.now();

    private String source; // MANUAL, PUSH, AUTO

    private Long latencySeconds; // seconds difference between scheduled and actual

    private String notes;
}
