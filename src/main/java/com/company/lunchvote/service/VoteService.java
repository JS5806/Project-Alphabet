package com.company.lunchvote.service;

import com.company.lunchvote.domain.Restaurant;
import com.company.lunchvote.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final RedisTemplate<String, String> redisTemplate;
    private final RestaurantRepository restaurantRepository;

    private static final String VOTE_HISTORY_PREFIX = "vote:history:"; // 사용자별 투표 여부 (SetNX용)
    private static final String VOTE_COUNT_PREFIX = "vote:count:";     // 식당별 득표수 (Hash)

    /**
     * 식당 후보 리스트 조회
     */
    public List<Restaurant> getCandidates() {
        return restaurantRepository.findAll();
    }

    /**
     * 투표 실행 (Atomic)
     * 1. 오늘 날짜 기준 사용자 중복 투표 체크 (Redis SETNX)
     * 2. 식당 득표수 증가 (Redis HINCRBY)
     */
    public void vote(String userId, Long restaurantId) {
        String today = LocalDate.now().toString();
        String userHistoryKey = VOTE_HISTORY_PREFIX + today + ":" + userId;
        String voteCountKey = VOTE_COUNT_PREFIX + today;

        // 1. 중복 투표 방지 (Atomic Operation: SETNX)
        // 키가 존재하지 않으면 세팅하고 true 반환, 이미 존재하면 false 반환
        Boolean isFirstVote = redisTemplate.opsForValue().setIfAbsent(userHistoryKey, "VOTED");

        if (Boolean.FALSE.equals(isFirstVote)) {
            throw new IllegalStateException("User has already voted today.");
        }

        // 2. 투표 수 증가 (Atomic Operation)
        redisTemplate.opsForHash().increment(voteCountKey, String.valueOf(restaurantId), 1);
    }

    /**
     * 최다 득표 결과 집계
     * 동점자 발생 시 랜덤 우선순위 로직 적용
     */
    public Restaurant getWinner() {
        String today = LocalDate.now().toString();
        String voteCountKey = VOTE_COUNT_PREFIX + today;

        // Redis Hash에서 모든 식당의 득표수 조회
        Map<Object, Object> votes = redisTemplate.opsForHash().entries(voteCountKey);

        if (votes.isEmpty()) {
            throw new IllegalStateException("No votes cast today.");
        }

        // 최대 득표수 계산
        long maxVotes = votes.values().stream()
                .map(obj -> Long.parseLong(obj.toString()))
                .max(Long::compare)
                .orElse(0L);

        // 최다 득표 식당 ID 목록 추출
        List<Long> topRestaurantIds = votes.entrySet().stream()
                .filter(entry -> Long.parseLong(entry.getValue().toString()) == maxVotes)
                .map(entry -> Long.parseLong(entry.getKey().toString()))
                .collect(Collectors.toList());

        // 동점자 처리: 랜덤 선택
        if (topRestaurantIds.size() > 1) {
            Collections.shuffle(topRestaurantIds);
        }

        Long winnerId = topRestaurantIds.get(0);
        return restaurantRepository.findById(winnerId)
                .orElseThrow(() -> new IllegalStateException("Restaurant not found"));
    }
    
    /**
     * 현재 투표 현황 조회 (옵션)
     */
    public Map<Object, Object> getCurrentStatus() {
        String today = LocalDate.now().toString();
        return redisTemplate.opsForHash().entries(VOTE_COUNT_PREFIX + today);
    }
}