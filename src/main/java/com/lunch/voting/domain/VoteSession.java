package com.lunch.voting.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "vote_session")
public class VoteSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime validDate; // 투표 대상 날짜

    @Column(nullable = false)
    private LocalDateTime deadline; // 마감 시간

    @Builder
    public VoteSession(LocalDateTime validDate, LocalDateTime deadline) {
        this.validDate = validDate;
        this.deadline = deadline;
    }

    // 마감 시간 확인 로직
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.deadline);
    }
}