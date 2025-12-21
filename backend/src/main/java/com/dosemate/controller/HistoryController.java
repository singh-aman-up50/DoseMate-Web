package com.dosemate.controller;

import com.dosemate.model.History;
import com.dosemate.model.ReminderStatus;
import com.dosemate.service.HistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<List<History>> list(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(historyService.getUserHistory(email));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<History>> getByDateRange(
            Authentication authentication,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        String email = authentication.getName();
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return ResponseEntity.ok(historyService.getUserHistoryByDateRange(email, start, end));
    }

    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<List<History>> getMedicineHistory(
            Authentication authentication,
            @PathVariable Long medicineId) {
        String email = authentication.getName();
        return ResponseEntity.ok(historyService.getHistoryByMedicine(medicineId, email));
    }

    @PostMapping
    public ResponseEntity<History> record(
            Authentication authentication,
            @RequestBody Map<String, Object> request) {
        String email = authentication.getName();
        Long reminderId = ((Number) request.get("reminderId")).longValue();
        String statusStr = (String) request.get("status");
        String source = (String) request.getOrDefault("source", "MANUAL");
        String notes = (String) request.getOrDefault("notes", null);

        ReminderStatus status = ReminderStatus.valueOf(statusStr);
        History h = historyService.recordHistory(reminderId, status, source, notes);
        return ResponseEntity.status(HttpStatus.CREATED).body(h);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdherenceStats(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(historyService.getAdherenceStats(email));
    }

    @GetMapping("/stats/medicine/{medicineId}")
    public ResponseEntity<Map<String, Object>> getMedicineStats(
            Authentication authentication,
            @PathVariable Long medicineId) {
        String email = authentication.getName();
        return ResponseEntity.ok(historyService.getAdherenceStatsByMedicine(medicineId, email));
    }

    @GetMapping("/stats/weekly")
    public ResponseEntity<List<Map<String, Object>>> getWeeklyAdherence(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(historyService.getWeeklyAdherence(email));
    }
}

