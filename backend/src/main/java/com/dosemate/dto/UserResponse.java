package com.dosemate.dto;

import com.dosemate.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private Integer age;
    private String profilePictureUrl;
    private String bio;

    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getAge(),
                user.getProfilePictureUrl(),
                user.getBio()
        );
    }
}
