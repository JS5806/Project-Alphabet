package com.lunch.voting.repository;

import com.lunch.voting.domain.VoteSession;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface VoteSessionRepository extends JpaRepository<VoteSession, Long> {

    // [Technical Risk Solved] 동시성 이슈 - 마감 직전 투표 시 Pessimistic Lock(비관적 락) 사용
    // 데이터 정합성을 위해 세션 조회 시 Write Lock을 걸어 다른 트랜잭션이 수정/읽기를 대기하도록 함
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM VoteSession v WHERE v.id = :id")
    Optional<VoteSession> findByIdWithLock(@Param("id") Long id);

    // 현재 활성화된(마감되지 않은) 세션 조회
    @Query("SELECT v FROM VoteSession v WHERE v.validDate >= :startOfDay AND v.validDate < :endOfDay")
    Optional<VoteSession> findByValidDateBetween(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
}