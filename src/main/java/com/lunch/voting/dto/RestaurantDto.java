package com.lunch.voting.dto;

import lombok.Data;

public class RestaurantDto {

    @Data
    public static class CreateRequest {
        private String name;
        private String category;
        private String description;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String category;
        private String description;
        
        public Response(Long id, String name, String category, String description) {
            this.id = id;
            this.name = name;
            this.category = category;
            this.description = description;
        }
    }
}