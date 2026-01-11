package com.lunch.voting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class VoteDto {

    @Data
    public static class SessionRequest {
        private Integer deadlineHour; // 마감 시간(시)
        private Integer deadlineMinute; // 마감 시간(분)
    }

    @Data
    public static class VoteRequest {
        private Long sessionId;
        private Long restaurantId;
        private String userId; // 실제 인증 대신 ID 직접 입력
    }

    @Data
    @AllArgsConstructor
    public static class StatResponse {
        private Long restaurantId;
        private String restaurantName;
        private Long voteCount;
        private Boolean isWinner;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SessionResponse {
        private Long id;
        private LocalDateTime validDate;
        private LocalDateTime deadline;
        private boolean isActive;
    }
}