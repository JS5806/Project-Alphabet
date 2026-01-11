package com.company.lunchvote.service;

import com.company.lunchvote.config.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * [Mock API] 사내 인증 시스템 연동 시뮬레이션
     * 실제 환경에서는 LDAP/SSO API를 호출해야 하지만,
     * MVP 단계에서는 아이디/비밀번호가 일치하면 토큰을 발급한다.
     */
    public String mockLogin(String username, String password) {
        // 임시 로직: 비밀번호가 "test1234"일 경우 인증 성공으로 간주
        if ("test1234".equals(password)) {
            // 사용자 ID를 기반으로 JWT 발급
            return jwtTokenProvider.createToken(username);
        }
        throw new IllegalArgumentException("Invalid credentials");
    }
}