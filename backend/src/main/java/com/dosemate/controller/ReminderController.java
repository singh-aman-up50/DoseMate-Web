package com.dosemate.controller;

import com.dosemate.dto.ReminderDTO;
import com.dosemate.service.ReminderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @PostMapping("/medicine/{medicineId}")
    public ResponseEntity<ReminderDTO> createReminder(
            Authentication authentication, 
            @PathVariable Long medicineId,
            @RequestBody ReminderDTO reminderDTO) {
        String email = authentication.getName();
        ReminderDTO created = reminderService.createReminder(reminderDTO, medicineId, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<List<ReminderDTO>> getRemindersByMedicine(
            Authentication authentication,
            @PathVariable Long medicineId) {
        String email = authentication.getName();
        return ResponseEntity.ok(reminderService.getRemindersByMedicine(medicineId, email));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ReminderDTO>> getPendingReminders(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reminderService.getPendingReminders(email));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ReminderDTO>> getUpcomingReminders(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reminderService.getUpcomingReminders(email));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReminderDTO> updateStatus(
            Authentication authentication, 
            @PathVariable Long id, 
            @RequestBody Map<String, String> request) {
        String email = authentication.getName();
        String status = request.get("status");
        ReminderDTO updated = reminderService.updateReminderStatus(id, status, email);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/snooze")
    public ResponseEntity<ReminderDTO> snoozeReminder(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        String email = authentication.getName();
        Integer minutes = request.getOrDefault("minutes", 10);
        ReminderDTO snoozed = reminderService.snoozeReminder(id, minutes, email);
        return ResponseEntity.ok(snoozed);
    }
}

