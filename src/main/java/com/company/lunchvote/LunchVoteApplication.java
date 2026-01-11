package com.company.lunchvote;

import com.company.lunchvote.domain.Restaurant;
import com.company.lunchvote.repository.RestaurantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class LunchVoteApplication {

    public static void main(String[] args) {
        SpringApplication.run(LunchVoteApplication.class, args);
    }

    // 초기 데이터 세팅 (MVP용)
    @Bean
    public CommandLineRunner initData(RestaurantRepository restaurantRepository) {
        return args -> {
            if (restaurantRepository.count() == 0) {
                restaurantRepository.saveAll(List.of(
                        new Restaurant("한식 뷔페", "KOREAN"),
                        new Restaurant("버거킹", "FASTFOOD"),
                        new Restaurant("사내 식당 A코스", "IN_HOUSE"),
                        new Restaurant("순대국밥", "KOREAN"),
                        new Restaurant("파스타 전문점", "WESTERN")
                ));
            }
        };
    }
}