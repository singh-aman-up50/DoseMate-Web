package com.dosemate.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CaregiverRequestDTO {
    private Long caregiverId; // used when caregiver adds patient by finding them
    private String inviteCode; // used when caregiver accepts invite from patient
    private String relationship; // e.g., "son", "daughter", "nurse"
    private String patientEmail; // patient email (used by caregiver to search)
}
