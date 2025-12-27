package com.dosemate.controller;

import com.dosemate.dto.MedicineDTO;
import com.dosemate.service.MedicineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @PostMapping
    public ResponseEntity<MedicineDTO> createMedicine(Authentication authentication, @RequestBody MedicineDTO medicineDTO) {
        String email = authentication.getName();
        MedicineDTO created = medicineService.createMedicine(medicineDTO, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<MedicineDTO>> list(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(medicineService.getUserMedicines(email));
    }

    @GetMapping("/active")
    public ResponseEntity<List<MedicineDTO>> getActiveMedicines(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(medicineService.getActiveMedicines(email));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MedicineDTO>> search(Authentication authentication, @RequestParam String query) {
        String email = authentication.getName();
        return ResponseEntity.ok(medicineService.searchMedicines(query, email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineDTO> getById(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        return ResponseEntity.ok(medicineService.getMedicineById(id, email));
    }

    @GetMapping("/{id}/stock-status")
    public ResponseEntity<Map<String, Object>> getStockStatus(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        MedicineDTO medicine = medicineService.getMedicineById(id, email);
        boolean lowStock = medicineService.isLowStock(id, email);
        
        Map<String, Object> response = new HashMap<>();
        response.put("medicineId", id);
        response.put("currentStock", medicine.getStock() != null ? medicine.getStock() : 0);
        response.put("refillThreshold", medicine.getRefillThreshold() != null ? medicine.getRefillThreshold() : 10);
        response.put("isLowStock", lowStock);
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineDTO> update(Authentication authentication, @PathVariable Long id, @RequestBody MedicineDTO medicineDTO) {
        String email = authentication.getName();
        return ResponseEntity.ok(medicineService.updateMedicine(id, medicineDTO, email));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<MedicineDTO> updateStock(Authentication authentication, @PathVariable Long id, @RequestBody Map<String, Integer> request) {
        String email = authentication.getName();
        Integer newStock = request.get("stock");
        return ResponseEntity.ok(medicineService.updateStock(id, newStock, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        medicineService.deleteMedicine(id, email);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Medicine deleted successfully");
        return ResponseEntity.ok(response);
    }
}
