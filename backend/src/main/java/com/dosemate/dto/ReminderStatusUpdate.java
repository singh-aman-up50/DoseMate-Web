package com.dosemate.dto;

import lombok.Data;

@Data
public class ReminderStatusUpdate {
    private String status; // PENDING, TAKEN, MISSED
}
