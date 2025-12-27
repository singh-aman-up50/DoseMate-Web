package com.dosemate.repository;

import com.dosemate.model.CaregiverRelation;
import com.dosemate.model.CaregiverStatus;
import com.dosemate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaregiverRelationRepository extends JpaRepository<CaregiverRelation, Long> {
    List<CaregiverRelation> findByCaregiver(User caregiver);
    List<CaregiverRelation> findByCaregiverAndStatus(User caregiver, CaregiverStatus status);
    List<CaregiverRelation> findByPatient(User patient);
    List<CaregiverRelation> findByPatientAndStatus(User patient, CaregiverStatus status);
    Optional<CaregiverRelation> findByInviteCode(String inviteCode);
    Optional<CaregiverRelation> findByCaregiverAndPatient(User caregiver, User patient);
    List<CaregiverRelation> findByCaregiverAndStatusOrderByCreatedAtDesc(User caregiver, CaregiverStatus status);
}
