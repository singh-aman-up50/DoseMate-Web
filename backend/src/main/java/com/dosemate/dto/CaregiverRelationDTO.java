package com.dosemate.dto;

import com.dosemate.model.CaregiverStatus;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CaregiverRelationDTO {
    private Long id;
    private Long caregiverId;
    private String caregiverName;
    private String caregiverEmail;
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String relationship;
    private CaregiverStatus status;
    private String inviteCode;
    private Instant createdAt;
    private Instant approvedAt;
}
