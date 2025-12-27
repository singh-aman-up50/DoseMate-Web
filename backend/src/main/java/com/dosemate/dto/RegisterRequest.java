package com.dosemate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    private String phone;

    private String address;

    @Min(value = 1, message = "Age must be positive if provided")
    private Integer age;

    private String role; // "ROLE_USER" or "ROLE_CAREGIVER"
    // Optional caregiver-specific registration fields
    private String organization;
    private String licenseNumber;
    private String specialization;
    private Integer yearsExperience;
}
