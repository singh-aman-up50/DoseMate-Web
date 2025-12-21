package com.dosemate.dto;

import com.dosemate.model.Medicine;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineDTO {
    private Long id;
    private String name;
    private String brand;
    private String dosage;
    private String strength;
    private String frequency;
    private String route; // oral, injection, topical, etc.
    private String unit; // tablet, capsule, ml, etc.
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> reminderTimes;
    private Integer stock; // current quantity
    private Integer refillThreshold; // low stock warning
    private List<String> imageUrls; // medicine images
    private Set<String> tags; // e.g., antibiotic, painkiller, vitamin
    private String notes; // prescription notes
    private boolean active;

    public static MedicineDTO fromEntity(Medicine medicine) {
        MedicineDTO dto = new MedicineDTO();
        dto.setId(medicine.getId());
        dto.setName(medicine.getName());
        dto.setBrand(medicine.getBrand());
        dto.setDosage(medicine.getDosage());
        dto.setStrength(medicine.getStrength());
        dto.setFrequency(medicine.getFrequency());
        dto.setRoute(medicine.getRoute());
        dto.setUnit(medicine.getUnit());
        dto.setStartDate(medicine.getStartDate());
        dto.setEndDate(medicine.getEndDate());
        dto.setReminderTimes(medicine.getReminderTimes());
        dto.setStock(medicine.getStock());
        dto.setRefillThreshold(medicine.getRefillThreshold());
        dto.setImageUrls(medicine.getImageUrls());
        dto.setTags(medicine.getTags());
        dto.setNotes(medicine.getNotes());
        dto.setActive(medicine.isActive());
        return dto;
    }
}
