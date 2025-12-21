package com.dosemate.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class IntakeRequest {
    private Long reminderId;
    private String status; // TAKEN, SKIPPED, etc.
    private String source; // MANUAL, PUSH
    private String notes;
}
