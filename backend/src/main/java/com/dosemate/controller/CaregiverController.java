package com.dosemate.controller;

import com.dosemate.dto.*;
import com.dosemate.model.History;
import com.dosemate.service.CaregiverService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/caregiver")
public class CaregiverController {

    private final CaregiverService caregiverService;

    public CaregiverController(CaregiverService caregiverService) {
        this.caregiverService = caregiverService;
    }

    // Patient generates invite code for caregiver
    @PostMapping("/generate-invite")
    public ResponseEntity<CaregiverRelationDTO> generateInviteCode(
            Authentication authentication,
            @RequestBody Map<String, String> request) {
        String patientEmail = authentication.getName();
        String caregiverEmail = request.get("caregiverEmail");
        String relationship = request.get("relationship");

        CaregiverRelationDTO dto = caregiverService.generateInviteCode(patientEmail, caregiverEmail, relationship);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    // Caregiver accepts invite using code
    @PostMapping("/accept-invite/{inviteCode}")
    public ResponseEntity<CaregiverRelationDTO> acceptInvite(
            @PathVariable String inviteCode) {
        CaregiverRelationDTO dto = caregiverService.acceptInvite(inviteCode);
        return ResponseEntity.ok(dto);
    }

    // Patient approves caregiver request
    @PutMapping("/{relationId}/approve")
    public ResponseEntity<CaregiverRelationDTO> approveCaregiver(
            Authentication authentication,
            @PathVariable Long relationId) {
        String patientEmail = authentication.getName();
        CaregiverRelationDTO dto = caregiverService.approveCaregiver(relationId, patientEmail);
        return ResponseEntity.ok(dto);
    }

    // Patient rejects caregiver request
    @PutMapping("/{relationId}/reject")
    public ResponseEntity<Void> rejectCaregiver(
            Authentication authentication,
            @PathVariable Long relationId) {
        String patientEmail = authentication.getName();
        caregiverService.rejectCaregiver(relationId, patientEmail);
        return ResponseEntity.noContent().build();
    }

    // Patient removes caregiver
    @DeleteMapping("/{relationId}")
    public ResponseEntity<Void> removeCaregiver(
            Authentication authentication,
            @PathVariable Long relationId) {
        String patientEmail = authentication.getName();
        caregiverService.removeCaregiver(relationId, patientEmail);
        return ResponseEntity.noContent().build();
    }

    // Caregiver gets list of all approved patients
    @GetMapping("/my-patients")
    public ResponseEntity<List<PatientOverviewDTO>> getCaregiverPatients(
            Authentication authentication) {
        String caregiverEmail = authentication.getName();
        List<PatientOverviewDTO> patients = caregiverService.getCaregiverPatients(caregiverEmail);
        return ResponseEntity.ok(patients);
    }

    // Caregiver views pending invites addressed to them
    @GetMapping("/pending-invites")
    public ResponseEntity<List<CaregiverRelationDTO>> getPendingInvites(
            Authentication authentication) {
        String caregiverEmail = authentication.getName();
        List<CaregiverRelationDTO> invites = caregiverService.getPendingInvitesForCaregiver(caregiverEmail);
        return ResponseEntity.ok(invites);
    }

    // Caregiver responds to an invite (ACCEPT or REJECT)
    @PostMapping("/{relationId}/respond")
    public ResponseEntity<CaregiverRelationDTO> respondToInvite(
            Authentication authentication,
            @PathVariable Long relationId,
            @RequestBody Map<String, String> body) {
        String caregiverEmail = authentication.getName();
        String action = body.get("action");
        CaregiverRelationDTO dto = caregiverService.respondToInvite(relationId, caregiverEmail, action);
        return ResponseEntity.ok(dto);
    }

    // Caregiver views patient's reminders
    @GetMapping("/patient/{patientId}/reminders")
    public ResponseEntity<List<ReminderDTO>> getPatientReminders(
            Authentication authentication,
            @PathVariable Long patientId) {
        String caregiverEmail = authentication.getName();
        List<ReminderDTO> reminders = caregiverService.getPatientReminders(patientId, caregiverEmail);
        return ResponseEntity.ok(reminders);
    }

    // Caregiver views patient's history
    @GetMapping("/patient/{patientId}/history")
    public ResponseEntity<List<History>> getPatientHistory(
            Authentication authentication,
            @PathVariable Long patientId) {
        String caregiverEmail = authentication.getName();
        List<History> history = caregiverService.getPatientHistory(patientId, caregiverEmail);
        return ResponseEntity.ok(history);
    }

    // Patient views pending caregiver requests
    @GetMapping("/pending-requests")
    public ResponseEntity<List<CaregiverRelationDTO>> getPendingRequests(
            Authentication authentication) {
        String patientEmail = authentication.getName();
        List<CaregiverRelationDTO> requests = caregiverService.getPendingRequests(patientEmail);
        return ResponseEntity.ok(requests);
    }

    // Patient views approved caregivers
    @GetMapping("/my-caregivers")
    public ResponseEntity<List<CaregiverRelationDTO>> getApprovedCaregivers(
            Authentication authentication) {
        String patientEmail = authentication.getName();
        List<CaregiverRelationDTO> caregivers = caregiverService.getApprovedCaregivers(patientEmail);
        return ResponseEntity.ok(caregivers);
    }
}
