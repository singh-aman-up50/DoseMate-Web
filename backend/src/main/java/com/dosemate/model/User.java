package com.dosemate.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    private String address;

    private Integer age;

    @Column(name = "profile_picture_url", columnDefinition = "text")
    private String profilePictureUrl;

    private String bio;
    // Caregiver-specific fields (optional)
    private String organization;
    private String licenseNumber;
    private String specialization;
    private Integer yearsExperience;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(50) CHECK (role IN ('ROLE_USER', 'ROLE_CAREGIVER', 'ROLE_ADMIN'))")
    private Role role;

    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.role == null) {
            this.role = Role.ROLE_USER;
        }
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = Instant.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
