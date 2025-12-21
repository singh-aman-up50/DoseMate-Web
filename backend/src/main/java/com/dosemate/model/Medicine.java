package com.dosemate.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String brand;

    private String strength;

    private String dosage;

    private String frequency; // e.g. DAILY, WEEKLY, CUSTOM

    private LocalDate startDate;

    private LocalDate endDate;

    @ElementCollection
    @CollectionTable(name = "medicine_reminder_times", joinColumns = @JoinColumn(name = "medicine_id"))
    private List<String> reminderTimes; // store as HH:mm strings

    @ElementCollection
    @CollectionTable(name = "medicine_images", joinColumns = @JoinColumn(name = "medicine_id"))
    private List<String> imageUrls;

    @ElementCollection
    @CollectionTable(name = "medicine_tags", joinColumns = @JoinColumn(name = "medicine_id"))
    private java.util.Set<String> tags;

    private Integer stock; // remaining pill count

    private String notes;

    private Integer refillThreshold; // when to alert for refill

    private String unit; // e.g., tablet, ml

    private String route; // oral, sublingual, etc.

    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
