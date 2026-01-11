package com.company.lunchvote.controller;

import com.company.lunchvote.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = authService.mockLogin(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(Map.of("accessToken", token));
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }
}