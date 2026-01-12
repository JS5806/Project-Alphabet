package com.example.recsys.repository;

import com.example.recsys.domain.QRestaurant;
import com.example.recsys.domain.Restaurant;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.recsys.domain.QRestaurant.restaurant;

@Repository
@RequiredArgsConstructor
public class RestaurantRepositoryImpl implements RestaurantRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    /**
     * [핵심 1] 랜덤 추천 최적화를 위한 ID 조회
     * 전체 Row를 가져오지 않고 ID만 조회하여 메모리/네트워크 비용 절감
     * 이 결과는 Service 계층에서 Redis에 캐싱됨.
     */
    @Override
    public List<Long> findIdsByConditions(String regionCode, String category, String priceRange) {
        return queryFactory
                .select(restaurant.id)
                .from(restaurant)
                .where(
                        eqRegion(regionCode),
                        eqCategory(category),
                        eqPriceRange(priceRange)
                )
                .fetch();
    }

    /**
     * 최종 선정된 ID 리스트로 식당 상세 정보 조회
     * WHERE id IN (...) 구문 사용
     */
    @Override
    public List<Restaurant> findAllByIds(List<Long> ids) {
        if (ids.isEmpty()) {
            return List.of();
        }
        return queryFactory
                .selectFrom(restaurant)
                .where(restaurant.id.in(ids))
                .fetch();
    }

    // 동적 쿼리를 위한 조건 함수들
    private BooleanExpression eqRegion(String regionCode) {
        return regionCode != null ? restaurant.regionCode.eq(regionCode) : null;
    }
    private BooleanExpression eqCategory(String category) {
        return category != null ? restaurant.category.eq(category) : null;
    }
    private BooleanExpression eqPriceRange(String priceRange) {
        return priceRange != null ? restaurant.priceRange.eq(priceRange) : null;
    }
}