package com.dosemate.controller;

import com.dosemate.dto.MedicineDTO;
import com.dosemate.service.MedicineService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MedicineController.class)
public class MedicineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MedicineService medicineService;
    
    @MockBean
    private com.dosemate.security.JwtUtils jwtUtils;

    @Test
    @WithMockUser(username = "user@example.com")
    void listMedicines_returnsList() throws Exception {
        MedicineDTO m = new MedicineDTO();
        m.setId(1L);
        m.setName("Aspirin");
        m.setDosage("1 tablet");
        m.setStartDate(LocalDate.now());
        m.setActive(true);

        when(medicineService.getUserMedicines("user@example.com")).thenReturn(Collections.singletonList(m));

        mockMvc.perform(get("/api/medicines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Aspirin"));
    }
}
