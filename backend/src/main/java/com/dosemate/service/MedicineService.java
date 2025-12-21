package com.dosemate.service;

import com.dosemate.dto.MedicineDTO;
import com.dosemate.model.Medicine;
import com.dosemate.model.Reminder;
import com.dosemate.model.User;
import com.dosemate.repository.MedicineRepository;
import com.dosemate.repository.UserRepository;
import com.dosemate.repository.ReminderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineService {
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final ReminderRepository reminderRepository;
    private final com.dosemate.repository.HistoryRepository historyRepository;

    public MedicineService(MedicineRepository medicineRepository, UserRepository userRepository, ReminderRepository reminderRepository, com.dosemate.repository.HistoryRepository historyRepository) {
        this.medicineRepository = medicineRepository;
        this.userRepository = userRepository;
        this.reminderRepository = reminderRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional
    public MedicineDTO createMedicine(MedicineDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Medicine medicine = new Medicine();
        medicine.setUser(user);
        medicine.setName(dto.getName());
        medicine.setBrand(dto.getBrand());
        medicine.setDosage(dto.getDosage());
        medicine.setStrength(dto.getStrength());
        medicine.setFrequency(dto.getFrequency());
        medicine.setRoute(dto.getRoute());
        medicine.setUnit(dto.getUnit());
        medicine.setStartDate(dto.getStartDate());
        medicine.setEndDate(dto.getEndDate());
        medicine.setReminderTimes(dto.getReminderTimes());
        medicine.setStock(dto.getStock() != null ? dto.getStock() : 0);
        medicine.setRefillThreshold(dto.getRefillThreshold() != null ? dto.getRefillThreshold() : 10);
        medicine.setImageUrls(dto.getImageUrls());
        medicine.setTags(dto.getTags());
        medicine.setNotes(dto.getNotes());
        medicine.setActive(true);
        
        return MedicineDTO.fromEntity(medicineRepository.save(medicine));
    }

    public List<MedicineDTO> getUserMedicines(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return medicineRepository.findByUser(user).stream()
                .map(MedicineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MedicineDTO> getActiveMedicines(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return medicineRepository.findByUser(user).stream()
                .filter(Medicine::isActive)
                .map(MedicineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public MedicineDTO getMedicineById(Long id, String userEmail) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        if (!medicine.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Not authorized");
        }
        return MedicineDTO.fromEntity(medicine);
    }

    @Transactional
    public MedicineDTO updateMedicine(Long id, MedicineDTO updated, String userEmail) {
        Medicine existing = medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        if (!existing.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Not authorized");
        }
        
        existing.setName(updated.getName());
        existing.setBrand(updated.getBrand());
        existing.setDosage(updated.getDosage());
        existing.setStrength(updated.getStrength());
        existing.setFrequency(updated.getFrequency());
        existing.setRoute(updated.getRoute());
        existing.setUnit(updated.getUnit());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setReminderTimes(updated.getReminderTimes());
        existing.setStock(updated.getStock() != null ? updated.getStock() : existing.getStock());
        existing.setRefillThreshold(updated.getRefillThreshold() != null ? updated.getRefillThreshold() : existing.getRefillThreshold());
        existing.setImageUrls(updated.getImageUrls());
        existing.setTags(updated.getTags());
        existing.setNotes(updated.getNotes());
        existing.setActive(updated.isActive());
        
        return MedicineDTO.fromEntity(medicineRepository.save(existing));
    }

    @Transactional
    public void deleteMedicine(Long id, String userEmail) {
        Medicine existing = medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        if (!existing.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Not authorized");
        }
        // Remove any reminders associated with this medicine to avoid foreign-key constraint errors
        try {
            List<Reminder> reminders = reminderRepository.findByMedicine(existing);
            if (reminders != null && !reminders.isEmpty()) {
                // Delete history entries for each reminder first to avoid FK constraint violations
                for (Reminder r : reminders) {
                    try {
                        historyRepository.deleteAllByReminder(r);
                    } catch (Exception he) {
                        System.err.println("Warning: failed to delete history for reminder " + r.getId() + ": " + he.getMessage());
                    }
                }
                // Now delete the reminders
                reminderRepository.deleteAll(reminders);
            }
        } catch (Exception e) {
            // log and continue with deletion; let GlobalExceptionHandler handle if something goes wrong
            System.err.println("Warning: failed to delete related reminders/history: " + e.getMessage());
        }
        medicineRepository.delete(existing);
    }

    @Transactional
    public MedicineDTO updateStock(Long id, Integer newStock, String userEmail) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        if (!medicine.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Not authorized");
        }
        medicine.setStock(newStock);
        return MedicineDTO.fromEntity(medicineRepository.save(medicine));
    }

    public boolean isLowStock(Long id, String userEmail) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        if (!medicine.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Not authorized");
        }
        return medicine.getStock() != null && medicine.getRefillThreshold() != null 
                && medicine.getStock() <= medicine.getRefillThreshold();
    }

    public List<MedicineDTO> searchMedicines(String query, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String lowerQuery = query.toLowerCase();
        return medicineRepository.findByUser(user).stream()
                .filter(m -> m.getName().toLowerCase().contains(lowerQuery) 
                        || (m.getBrand() != null && m.getBrand().toLowerCase().contains(lowerQuery))
                        || (m.getTags() != null && m.getTags().stream()
                                .anyMatch(t -> t.toLowerCase().contains(lowerQuery))))
                .map(MedicineDTO::fromEntity)
                .collect(Collectors.toList());
    }
}

