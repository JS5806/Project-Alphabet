package com.lunch.voting.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "vote",
    // [Technical Risk Solved] 중복 투표 방지 (DB Unique Constraint)
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_session_user", columnNames = {"session_id", "user_id"})
    }
)
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private VoteSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(nullable = false, name = "user_id")
    private String userId; // 실제 User 테이블 없이 식별자로만 사용

    @Builder
    public Vote(VoteSession session, Restaurant restaurant, String userId) {
        this.session = session;
        this.restaurant = restaurant;
        this.userId = userId;
    }

    public void changeRestaurant(Restaurant newRestaurant) {
        this.restaurant = newRestaurant;
    }
}