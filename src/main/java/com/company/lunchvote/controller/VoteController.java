package com.company.lunchvote.controller;

import com.company.lunchvote.domain.Restaurant;
import com.company.lunchvote.service.VoteService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vote")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    // 후보 리스트 조회
    @GetMapping("/candidates")
    public ResponseEntity<List<Restaurant>> getCandidates() {
        return ResponseEntity.ok(voteService.getCandidates());
    }

    // 투표하기
    @PostMapping
    public ResponseEntity<?> vote(@AuthenticationPrincipal String userId, @RequestBody VoteRequest request) {
        try {
            voteService.vote(userId, request.getRestaurantId());
            return ResponseEntity.ok(Map.of("message", "Vote successful"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 결과 조회 (최다 득표)
    @GetMapping("/result")
    public ResponseEntity<?> getResult() {
        try {
            Restaurant winner = voteService.getWinner();
            return ResponseEntity.ok(winner);
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(Map.of("message", "No votes yet or calculation error"));
        }
    }

    // 현황판 (디버깅용)
    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {
        return ResponseEntity.ok(voteService.getCurrentStatus());
    }

    @Data
    public static class VoteRequest {
        private Long restaurantId;
    }
}