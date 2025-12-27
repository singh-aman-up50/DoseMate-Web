package com.dosemate.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "caregiver_relations")
@Getter
@Setter
@NoArgsConstructor
public class CaregiverRelation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "caregiver_id", nullable = false)
    private User caregiver;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(length = 50)
    private String relationship; // "son", "daughter", "nurse", "doctor", "family_member"

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'PENDING'")
    private CaregiverStatus status; // PENDING, APPROVED, REJECTED, REMOVED

    private String inviteCode; // unique code for sharing invitation

    private Instant createdAt;
    private Instant approvedAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        if (this.status == null) {
            this.status = CaregiverStatus.PENDING;
        }
    }
}
