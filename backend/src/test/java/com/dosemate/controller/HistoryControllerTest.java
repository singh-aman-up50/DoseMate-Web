package com.dosemate.controller;

import com.dosemate.model.History;
import com.dosemate.model.Reminder;
import com.dosemate.model.ReminderStatus;
import com.dosemate.service.HistoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(HistoryController.class)
public class HistoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HistoryService historyService;

    @MockBean
    private com.dosemate.security.JwtUtils jwtUtils;

    @Test
    @WithMockUser(username = "user@example.com")
    void listHistory_returnsList() throws Exception {
        History h = new History();
        h.setId(1L);
        h.setStatus(ReminderStatus.TAKEN);
        h.setRecordedAt(Instant.now());

        when(historyService.getUserHistory("user@example.com")).thenReturn(Collections.singletonList(h));

        mockMvc.perform(get("/api/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    @WithMockUser
    void recordHistory_createsEntry() throws Exception {
        History h = new History();
        h.setId(2L);
        h.setStatus(ReminderStatus.TAKEN);

        when(historyService.recordHistory(1L, ReminderStatus.TAKEN, "MANUAL", "note")).thenReturn(h);

        String body = "{\"reminderId\":1,\"status\":\"TAKEN\",\"source\":\"MANUAL\",\"notes\":\"note\"}";

        mockMvc.perform(post("/api/history").contentType("application/json").content(body).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2));
    }
}
