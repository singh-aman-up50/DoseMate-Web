package com.dosemate.service;

import com.dosemate.dto.*;
import com.dosemate.model.*;
import com.dosemate.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CaregiverService {

    private final CaregiverRelationRepository caregiverRelationRepository;
    private final UserRepository userRepository;
    private final ReminderRepository reminderRepository;
    private final HistoryRepository historyRepository;
    private final MedicineRepository medicineRepository;

    public CaregiverService(
            CaregiverRelationRepository caregiverRelationRepository,
            UserRepository userRepository,
            ReminderRepository reminderRepository,
            HistoryRepository historyRepository,
            MedicineRepository medicineRepository) {
        this.caregiverRelationRepository = caregiverRelationRepository;
        this.userRepository = userRepository;
        this.reminderRepository = reminderRepository;
        this.historyRepository = historyRepository;
        this.medicineRepository = medicineRepository;
    }

    // Patient invites caregiver by generating a code
    @Transactional
    public CaregiverRelationDTO generateInviteCode(String patientEmail, String caregiverEmail, String relationship) {
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        User caregiver = userRepository.findByEmail(caregiverEmail)
                .orElseThrow(() -> new IllegalArgumentException("Caregiver not found"));

        // Check if relation already exists
        Optional<CaregiverRelation> existing = caregiverRelationRepository.findByCaregiverAndPatient(caregiver, patient);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Caregiver already linked to this patient");
        }

        String inviteCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        CaregiverRelation relation = new CaregiverRelation();
        relation.setCaregiver(caregiver);
        relation.setPatient(patient);
        relation.setRelationship(relationship != null ? relationship : "caregiver");
        relation.setInviteCode(inviteCode);
        relation.setStatus(CaregiverStatus.PENDING);

        CaregiverRelation saved = caregiverRelationRepository.save(relation);
        return mapToDTO(saved);
    }

    // Caregiver accepts invite using code
    @Transactional
    public CaregiverRelationDTO acceptInvite(String inviteCode) {
        CaregiverRelation relation = caregiverRelationRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invite code"));

        relation.setStatus(CaregiverStatus.APPROVED);
        relation.setApprovedAt(Instant.now());

        CaregiverRelation saved = caregiverRelationRepository.save(relation);
        return mapToDTO(saved);
    }

    // Patient approves caregiver request
    @Transactional
    public CaregiverRelationDTO approveCaregiver(Long relationId, String patientEmail) {
        CaregiverRelation relation = caregiverRelationRepository.findById(relationId)
                .orElseThrow(() -> new IllegalArgumentException("Relation not found"));

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!relation.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException("Not authorized");
        }

        relation.setStatus(CaregiverStatus.APPROVED);
        relation.setApprovedAt(Instant.now());

        CaregiverRelation saved = caregiverRelationRepository.save(relation);
        return mapToDTO(saved);
    }

    // Patient rejects caregiver request
    @Transactional
    public void rejectCaregiver(Long relationId, String patientEmail) {
        CaregiverRelation relation = caregiverRelationRepository.findById(relationId)
                .orElseThrow(() -> new IllegalArgumentException("Relation not found"));

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!relation.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException("Not authorized");
        }

        relation.setStatus(CaregiverStatus.REJECTED);
        caregiverRelationRepository.save(relation);
    }

    // Patient removes caregiver
    @Transactional
    public void removeCaregiver(Long relationId, String patientEmail) {
        CaregiverRelation relation = caregiverRelationRepository.findById(relationId)
                .orElseThrow(() -> new IllegalArgumentException("Relation not found"));

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!relation.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException("Not authorized");
        }

        caregiverRelationRepository.delete(relation);
    }

    // Caregiver lists all approved patients
    public List<PatientOverviewDTO> getCaregiverPatients(String caregiverEmail) {
        User caregiver = userRepository.findByEmail(caregiverEmail)
                .orElseThrow(() -> new IllegalArgumentException("Caregiver not found"));

        List<CaregiverRelation> relations = caregiverRelationRepository.findByCaregiverAndStatus(caregiver, CaregiverStatus.APPROVED);

        return relations.stream()
                .map(relation -> buildPatientOverview(relation.getPatient()))
                .collect(Collectors.toList());
    }

    // Get specific patient's reminders
    public List<ReminderDTO> getPatientReminders(Long patientId, String caregiverEmail) {
        User caregiver = userRepository.findByEmail(caregiverEmail)
                .orElseThrow(() -> new IllegalArgumentException("Caregiver not found"));

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        // Check if caregiver is approved for this patient
        Optional<CaregiverRelation> relation = caregiverRelationRepository.findByCaregiverAndPatient(caregiver, patient);
        if (relation.isEmpty() || !relation.get().getStatus().equals(CaregiverStatus.APPROVED)) {
            throw new IllegalArgumentException("Not authorized to view this patient");
        }

        return reminderRepository.findByMedicine_User(patient).stream()
                .map(ReminderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Get patient's history
    public List<History> getPatientHistory(Long patientId, String caregiverEmail) {
        User caregiver = userRepository.findByEmail(caregiverEmail)
                .orElseThrow(() -> new IllegalArgumentException("Caregiver not found"));

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        // Check if caregiver is approved
        Optional<CaregiverRelation> relation = caregiverRelationRepository.findByCaregiverAndPatient(caregiver, patient);
        if (relation.isEmpty() || !relation.get().getStatus().equals(CaregiverStatus.APPROVED)) {
            throw new IllegalArgumentException("Not authorized to view this patient");
        }

        return historyRepository.findByReminder_Medicine_UserOrderByRecordedAtDesc(patient);
    }

    // Get pending caregiver requests (for patient)
    public List<CaregiverRelationDTO> getPendingRequests(String patientEmail) {
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        return caregiverRelationRepository.findByPatientAndStatus(patient, CaregiverStatus.PENDING).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get pending invites where the logged-in user is the caregiver (caregiver has accepted invite or pending)
    public List<CaregiverRelationDTO> getPendingInvitesForCaregiver(String caregiverEmail) {
        User caregiver = userRepository.findByEmail(caregiverEmail)
                .orElseThrow(() -> new IllegalArgumentException("Caregiver not found"));

        return caregiverRelationRepository.findByCaregiverAndStatus(caregiver, CaregiverStatus.PENDING).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

        // Caregiver accepts or rejects a pending invite (authenticated caregiver)
        @Transactional
        public CaregiverRelationDTO respondToInvite(Long relationId, String caregiverEmail, String action) {
                CaregiverRelation relation = caregiverRelationRepository.findById(relationId)
                                .orElseThrow(() -> new IllegalArgumentException("Relation not found"));

                User caregiver = userRepository.findByEmail(caregiverEmail)
                                .orElseThrow(() -> new IllegalArgumentException("Caregiver not found"));

                if (!relation.getCaregiver().getId().equals(caregiver.getId())) {
                        throw new IllegalArgumentException("Not authorized to respond to this invite");
                }

                if (relation.getStatus() != CaregiverStatus.PENDING) {
                        throw new IllegalArgumentException("Invite is not in pending state");
                }

                if ("ACCEPT".equalsIgnoreCase(action)) {
                        relation.setStatus(CaregiverStatus.APPROVED);
                        relation.setApprovedAt(Instant.now());
                } else if ("REJECT".equalsIgnoreCase(action)) {
                        relation.setStatus(CaregiverStatus.REJECTED);
                } else {
                        throw new IllegalArgumentException("Invalid action. Use ACCEPT or REJECT");
                }

                CaregiverRelation saved = caregiverRelationRepository.save(relation);
                return mapToDTO(saved);
        }

    // Patient's view of approved caregivers
    public List<CaregiverRelationDTO> getApprovedCaregivers(String patientEmail) {
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        return caregiverRelationRepository.findByPatientAndStatus(patient, CaregiverStatus.APPROVED).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PatientOverviewDTO buildPatientOverview(User patient) {
        List<Reminder> pendingReminders = reminderRepository.findByMedicine_UserAndStatus(patient, ReminderStatus.PENDING);
        List<History> missedHistory = historyRepository.findByReminder_Medicine_User(patient).stream()
                .filter(h -> h.getStatus() == ReminderStatus.MISSED)
                .collect(Collectors.toList());

        List<Medicine> medicines = medicineRepository.findByUser(patient);
        long medicineCount = medicines.stream().filter(Medicine::isActive).count();

        // Calculate adherence
        List<History> allHistory = historyRepository.findByReminder_Medicine_User(patient);
        long taken = allHistory.stream().filter(h -> h.getStatus() == ReminderStatus.TAKEN).count();
        double adherenceRate = allHistory.isEmpty() ? 0.0 : (double) taken / allHistory.size() * 100;

        PatientOverviewDTO dto = new PatientOverviewDTO();
        dto.setPatientId(patient.getId());
        dto.setPatientName(patient.getFirstName() + " " + (patient.getLastName() != null ? patient.getLastName() : ""));
        dto.setPatientEmail(patient.getEmail());
        dto.setAge(patient.getAge());
        dto.setPhone(patient.getPhone());
        dto.setPendingRemindersCount(pendingReminders.size());
        dto.setMissedRemindersCount(missedHistory.size());
        dto.setAdherenceRate(adherenceRate);
        dto.setMedicinesCount(medicineCount);

        // Last activity
                if (!allHistory.isEmpty()) {
                        History lastHistory = allHistory.get(0);
                        dto.setLastActivity(lastHistory.getRecordedAt() != null ? lastHistory.getRecordedAt().toString() : null);
                }

        return dto;
    }

    private CaregiverRelationDTO mapToDTO(CaregiverRelation relation) {
        return new CaregiverRelationDTO(
                relation.getId(),
                relation.getCaregiver().getId(),
                relation.getCaregiver().getFirstName() + " " + (relation.getCaregiver().getLastName() != null ? relation.getCaregiver().getLastName() : ""),
                relation.getCaregiver().getEmail(),
                relation.getPatient().getId(),
                relation.getPatient().getFirstName() + " " + (relation.getPatient().getLastName() != null ? relation.getPatient().getLastName() : ""),
                relation.getPatient().getEmail(),
                relation.getRelationship(),
                relation.getStatus(),
                relation.getInviteCode(),
                relation.getCreatedAt(),
                relation.getApprovedAt()
        );
    }
}
