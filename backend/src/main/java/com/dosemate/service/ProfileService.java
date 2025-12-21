package com.dosemate.service;

import com.dosemate.dto.ChangePasswordRequest;
import com.dosemate.dto.UpdateProfileRequest;
import com.dosemate.dto.UserResponse;
import com.dosemate.model.User;
import com.dosemate.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getUserProfile(String email) {
        log.info("Fetching profile for user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest req) {
        log.info("Updating profile for user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (req.getFirstName() != null && !req.getFirstName().isBlank()) {
            user.setFirstName(req.getFirstName());
        }
        if (req.getLastName() != null && !req.getLastName().isBlank()) {
            user.setLastName(req.getLastName());
        }
        if (req.getPhone() != null) {
            user.setPhone(req.getPhone());
        }
        if (req.getAddress() != null) {
            user.setAddress(req.getAddress());
        }
        if (req.getAge() != null) {
            user.setAge(req.getAge());
        }
        if (req.getBio() != null) {
            user.setBio(req.getBio());
        }
        if (req.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(req.getProfilePictureUrl());
        }

        User updated = userRepository.save(user);
        log.info("Profile updated successfully for user: {}", email);
        return UserResponse.fromEntity(updated);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
        log.info("Changing password for user: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            log.warn("Invalid current password for user: {}", email);
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Check if passwords match
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            log.warn("New passwords do not match for user: {}", email);
            throw new IllegalArgumentException("New passwords do not match");
        }

        // Prevent using same password
        if (passwordEncoder.matches(req.getNewPassword(), user.getPassword())) {
            log.warn("New password same as old password for user: {}", email);
            throw new IllegalArgumentException("New password cannot be same as current password");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", email);
    }

    @Transactional
    public void deleteAccount(String email) {
        log.info("Deleting account for user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.delete(user);
        log.info("Account deleted successfully for user: {}", email);
    }
}
