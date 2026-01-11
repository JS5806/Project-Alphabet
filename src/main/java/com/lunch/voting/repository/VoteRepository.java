package com.lunch.voting.repository;

import com.lunch.voting.domain.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    Optional<Vote> findBySessionIdAndUserId(Long sessionId, String userId);

    // 집계를 위한 DTO Projection JPQL
    // N+1 문제 방지를 위해 Join Fetch 혹은 필요한 데이터만 조회
    @Query("SELECT v.restaurant.id, v.restaurant.name, COUNT(v) " +
           "FROM Vote v " +
           "WHERE v.session.id = :sessionId " +
           "GROUP BY v.restaurant.id, v.restaurant.name " +
           "ORDER BY COUNT(v) DESC")
    List<Object[]> countVotesBySessionId(@Param("sessionId") Long sessionId);
}