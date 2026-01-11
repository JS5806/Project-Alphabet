package com.lunch.voting.controller;

import com.lunch.voting.dto.VoteDto;
import com.lunch.voting.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/votes")
@RequiredArgsConstructor
@Tag(name = "Vote API", description = "투표 세션 및 참여 API")
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/session")
    @Operation(summary = "투표 세션 생성", description = "오늘 점심 투표방을 생성합니다.")
    public ResponseEntity<Long> createSession(@RequestBody VoteDto.SessionRequest request) {
        return ResponseEntity.ok(voteService.createSession(request));
    }

    @PostMapping
    @Operation(summary = "투표 참여", description = "특정 식당에 투표하거나 기존 투표를 변경합니다.")
    public ResponseEntity<String> castVote(@RequestBody VoteDto.VoteRequest request) {
        voteService.castVote(request);
        return ResponseEntity.ok("투표가 완료되었습니다.");
    }

    @GetMapping("/session/{sessionId}/stats")
    @Operation(summary = "투표 결과 집계", description = "실시간 득표 현황 및 1위 식당을 조회합니다.")
    public ResponseEntity<List<VoteDto.StatResponse>> getStats(@PathVariable Long sessionId) {
        return ResponseEntity.ok(voteService.getSessionStats(sessionId));
    }
}