package com.dosemate.service;

import com.dosemate.dto.AuthResponse;
import com.dosemate.dto.LoginRequest;
import com.dosemate.dto.RegisterRequest;
import com.dosemate.dto.UserResponse;
import com.dosemate.model.User;
import com.dosemate.repository.UserRepository;
import com.dosemate.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        log.info("Register request for email: {}", req.getEmail());
        try {
            if (userRepository.existsByEmail(req.getEmail())) {
                log.warn("Email already exists: {}", req.getEmail());
                throw new IllegalArgumentException("Email already in use");
            }
            if (!req.getPassword().equals(req.getConfirmPassword())) {
                log.warn("Passwords do not match for email: {}", req.getEmail());
                throw new IllegalArgumentException("Passwords do not match");
            }

            User user = new User();
            user.setFirstName(req.getFirstName());
            user.setLastName(req.getLastName());
            user.setEmail(req.getEmail());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setPhone(req.getPhone());
            user.setAddress(req.getAddress());
            user.setAge(req.getAge());
            User saved = userRepository.save(user);
            log.info("User registered successfully: {}", saved.getEmail());
            
            String token = jwtUtils.generateToken(saved.getEmail());
            return new AuthResponse(token, UserResponse.fromEntity(saved));
        } catch (Exception e) {
            log.error("Registration error: ", e);
            throw e;
        }
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String token = jwtUtils.generateToken(req.getEmail());
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }
}
