package com.dosemate.controller;

import com.dosemate.dto.ReminderDTO;
import com.dosemate.service.ReminderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReminderController.class)
public class ReminderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReminderService reminderService;

    @MockBean
    private com.dosemate.security.JwtUtils jwtUtils;

    @Test
    @WithMockUser(username = "user@example.com")
    void listReminders_returnsList() throws Exception {
        ReminderDTO r = new ReminderDTO();
        r.setId(1L);
        r.setScheduledAt(LocalDateTime.now().plusMinutes(1));

        when(reminderService.getPendingReminders("user@example.com")).thenReturn(Collections.singletonList(r));

        mockMvc.perform(get("/api/reminders/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }
}
