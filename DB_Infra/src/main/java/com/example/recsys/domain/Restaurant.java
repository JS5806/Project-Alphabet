package com.example.recsys.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "restaurants", indexes = {
    @Index(name = "idx_rest_composite", columnList = "region_code, category, price_range")
})
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    
    @Column(name = "price_range")
    private String priceRange;
    
    @Column(name = "region_code")
    private String regionCode;

    // 생성자 및 기타 필드 생략
}