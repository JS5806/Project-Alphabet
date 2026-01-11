package com.lunch.voting.service;

import com.lunch.voting.domain.Restaurant;
import com.lunch.voting.domain.Vote;
import com.lunch.voting.domain.VoteSession;
import com.lunch.voting.dto.VoteDto;
import com.lunch.voting.repository.RestaurantRepository;
import com.lunch.voting.repository.VoteRepository;
import com.lunch.voting.repository.VoteSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteSessionRepository voteSessionRepository;
    private final VoteRepository voteRepository;
    private final RestaurantRepository restaurantRepository;

    /**
     * 오늘의 투표 세션 생성
     */
    @Transactional
    public Long createSession(VoteDto.SessionRequest request) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime deadline = LocalDateTime.of(LocalDate.now(), LocalTime.of(request.getDeadlineHour(), request.getDeadlineMinute()));
        
        if (deadline.isBefore(now)) {
            throw new IllegalArgumentException("마감 시간은 현재 시간 이후여야 합니다.");
        }

        VoteSession session = VoteSession.builder()
                .validDate(now)
                .deadline(deadline)
                .build();
        
        return voteSessionRepository.save(session).getId();
    }

    /**
     * 투표하기 (핵심 로직)
     * [Technical Risk Solved] Concurrency: Pessimistic Lock 적용으로 마감 시간 임계점에서의 동시성 보장
     */
    @Transactional
    public void castVote(VoteDto.VoteRequest request) {
        // 1. 세션 조회 (Lock 적용)
        VoteSession session = voteSessionRepository.findByIdWithLock(request.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 세션입니다."));

        // 2. 마감 시간 검증
        if (session.isExpired()) {
            throw new IllegalStateException("투표가 마감되었습니다.");
        }

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 식당입니다."));

        // 3. 중복 투표 확인 또는 변경 처리
        // (DB Unique Key가 있지만, 비즈니스 로직상 변경 기능을 위해 조회 후 처리)
        voteRepository.findBySessionIdAndUserId(session.getId(), request.getUserId())
                .ifPresentOrElse(
                    existingVote -> {
                        // 이미 투표했다면 식당 변경
                        existingVote.changeRestaurant(restaurant);
                    },
                    () -> {
                        // 신규 투표
                        Vote newVote = Vote.builder()
                                .session(session)
                                .restaurant(restaurant)
                                .userId(request.getUserId())
                                .build();
                        voteRepository.save(newVote);
                    }
                );
    }

    /**
     * 결과 집계 조회
     * [Technical Risk Solved] N+1 Problem: JPQL Fetch Join 및 Group By 최적화 사용
     */
    @Transactional(readOnly = true)
    public List<VoteDto.StatResponse> getSessionStats(Long sessionId) {
        List<Object[]> results = voteRepository.countVotesBySessionId(sessionId);
        
        List<VoteDto.StatResponse> responseList = new ArrayList<>();
        long maxVotes = 0;

        // 1. 데이터 매핑 및 최다 득표 수 찾기
        for (Object[] row : results) {
            Long rId = (Long) row[0];
            String rName = (String) row[1];
            Long count = (Long) row[2];
            
            if (count > maxVotes) maxVotes = count;
            
            responseList.add(new VoteDto.StatResponse(rId, rName, count, false));
        }

        // 2. 우승 식당 마킹 (동점자 처리 포함)
        for (VoteDto.StatResponse dto : responseList) {
            if (dto.getVoteCount() == maxVotes && maxVotes > 0) {
                dto.setIsWinner(true);
            }
        }
        
        return responseList;
    }
}