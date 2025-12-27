package com.dosemate.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatientOverviewDTO {
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private Integer age;
    private String phone;
    private Integer pendingRemindersCount;
    private Integer missedRemindersCount;
    private Double adherenceRate;
    private Long medicinesCount;
    private String lastActivity; // last dose taken or reminder time
}
