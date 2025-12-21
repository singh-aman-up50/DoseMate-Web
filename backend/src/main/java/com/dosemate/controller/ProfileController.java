package com.dosemate.controller;

import com.dosemate.dto.ChangePasswordRequest;
import com.dosemate.dto.UpdateProfileRequest;
import com.dosemate.dto.UserResponse;
import com.dosemate.service.ProfileService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        log.info("GET /api/profile - User: {}", email);
        UserResponse profile = profileService.getUserProfile(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest req) {
        String email = authentication.getName();
        log.info("PUT /api/profile - Updating profile for user: {}", email);
        UserResponse updated = profileService.updateProfile(email, req);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest req) {
        String email = authentication.getName();
        log.info("POST /api/profile/change-password - User: {}", email);
        profileService.changePassword(email, req);
        return ResponseEntity.ok("Password changed successfully");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAccount(Authentication authentication) {
        String email = authentication.getName();
        log.info("DELETE /api/profile - Deleting account for user: {}", email);
        profileService.deleteAccount(email);
        return ResponseEntity.ok("Account deleted successfully");
    }

    @PostMapping("/upload-picture")
    public ResponseEntity<UserResponse> uploadProfilePicture(
            Authentication authentication,
            @RequestBody UpdateProfileRequest req) {
        String email = authentication.getName();
        log.info("POST /api/profile/upload-picture - User: {}", email);
        UserResponse updated = profileService.updateProfile(email, req);
        return ResponseEntity.ok(updated);
    }
}
