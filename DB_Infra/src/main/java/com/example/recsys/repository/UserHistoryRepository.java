package com.example.recsys.repository;

import com.example.recsys.domain.UserHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface UserHistoryRepository extends JpaRepository<UserHistory, Long> {
    // [핵심 3] 최근 방문 제외 로직을 위한 History 조회
    // 인덱스 (user_id, visited_at) 활용
    List<UserHistory> findByUserIdAndVisitedAtAfter(Long userId, LocalDateTime visitedAt);
}