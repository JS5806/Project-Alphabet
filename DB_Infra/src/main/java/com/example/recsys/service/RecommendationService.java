package com.example.recsys.service;

import com.example.recsys.domain.Restaurant;
import com.example.recsys.domain.UserHistory;
import com.example.recsys.repository.RestaurantRepository;
import com.example.recsys.repository.UserHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RestaurantRepository restaurantRepository;
    private final UserHistoryRepository userHistoryRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final long CACHE_TTL_HOURS = 1;

    /**
     * 랜덤 추천 메인 로직
     */
    @Transactional(readOnly = true)
    public List<Restaurant> recommendRestaurants(Long userId, String region, String category, String priceRange, int limit) {
        
        // 1. [Redis] 조건에 해당하는 전체 후보군 ID 리스트 조회
        // Key 설계: rest:ids:{region}:{category}:{price}
        String cacheKey = String.format("rest:ids:%s:%s:%s", region, category, priceRange);
        List<Long> candidateIds = getCachedCandidateIds(cacheKey);

        if (candidateIds == null || candidateIds.isEmpty()) {
            // Cache Miss: DB에서 필터링된 ID 목록 조회 (Covering Index 활용 가능성 높음)
            candidateIds = restaurantRepository.findIdsByConditions(region, category, priceRange);
            // Cache Update
            if (!candidateIds.isEmpty()) {
                redisTemplate.opsForValue().set(cacheKey, candidateIds, CACHE_TTL_HOURS, TimeUnit.HOURS);
            }
        }

        if (candidateIds.isEmpty()) {
            return new ArrayList<>();
        }

        // 2. [Anti-Join Logic] 최근 방문한 식당 제외
        // DB Join 대신, 최근 N일간의 방문 기록 ID만 가져와서 메모리에서 제거 (성능상 이점)
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        List<UserHistory> recentHistory = userHistoryRepository.findByUserIdAndVisitedAtAfter(userId, oneWeekAgo);
        Set<Long> visitedIds = recentHistory.stream()
                .map(UserHistory::getRestaurantId)
                .collect(Collectors.toSet());

        // 후보군에서 방문 기록 제외 (Copy list to avoid mutating cached list reference if it was direct)
        List<Long> filteredIds = candidateIds.stream()
                .filter(id -> !visitedIds.contains(id))
                .collect(Collectors.toList());

        // 3. [Random Shuffle] 애플리케이션 레벨 셔플링
        // 데이터가 수만 건 이상일 경우, 전체 shuffle 대신 Random Index Pick 방식 고려 가능
        Collections.shuffle(filteredIds);

        // 4. 상위 N개 추출
        List<Long> selectedIds = filteredIds.stream()
                .limit(limit)
                .collect(Collectors.toList());

        // 5. 최종 상세 정보 조회 (WHERE IN)
        return restaurantRepository.findAllByIds(selectedIds);
    }

    @SuppressWarnings("unchecked")
    private List<Long> getCachedCandidateIds(String key) {
        try {
            return (List<Long>) redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            return null;
        }
    }
}