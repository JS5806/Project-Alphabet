package com.lunch.voting.service;

import com.lunch.voting.domain.Restaurant;
import com.lunch.voting.dto.RestaurantDto;
import com.lunch.voting.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public Page<RestaurantDto.Response> getAllRestaurants(Pageable pageable) {
        // application.yml의 default_batch_fetch_size 설정으로 조회 성능 최적화됨
        return restaurantRepository.findAll(pageable)
                .map(r -> new RestaurantDto.Response(r.getId(), r.getName(), r.getCategory(), r.getDescription()));
    }

    @Transactional
    public Long createRestaurant(RestaurantDto.CreateRequest request) {
        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .category(request.getCategory())
                .description(request.getDescription())
                .build();
        return restaurantRepository.save(restaurant).getId();
    }
}