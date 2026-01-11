package com.lunch.voting.controller;

import com.lunch.voting.dto.RestaurantDto;
import com.lunch.voting.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurant API", description = "식당 관리 API")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    @Operation(summary = "식당 목록 조회", description = "페이징 처리된 식당 목록을 반환합니다.")
    public ResponseEntity<Page<RestaurantDto.Response>> getRestaurants(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(restaurantService.getAllRestaurants(pageable));
    }

    @PostMapping
    @Operation(summary = "식당 등록", description = "관리자용 식당 데이터 등록 API")
    public ResponseEntity<Long> createRestaurant(@RequestBody RestaurantDto.CreateRequest request) {
        return ResponseEntity.ok(restaurantService.createRestaurant(request));
    }
}