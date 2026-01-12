import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class VoteService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  // Redis Keys
  private readonly LEADERBOARD_KEY = 'vote:leaderboard'; // Sorted Set for Ranking
  private readonly VOTED_USER_KEY_PREFIX = 'vote:user:'; // Set to track who voted

  onModuleInit() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }

  /**
   * Redis 분산 락을 활용한 투표 처리
   * Team Comment: 동시성 제어를 위해 Lock 적용
   */
  async castVote(userId: number, restaurantId: number): Promise<boolean> {
    const lockKey = `lock:vote:user:${userId}`;
    const ttl = 5000; // Lock 유효 시간 5초

    // 1. 분산 락 획득 시도 (SET NX PX)
    // 동일 유저가 동시에 여러번 요청을 보내는 것을 방지
    const acquired = await this.redisClient.set(lockKey, 'LOCKED', 'PX', ttl, 'NX');

    if (!acquired) {
      // 락 획득 실패 시, 이미 처리 중인 요청으로 간주
      throw new Error('Too many requests. Please try again later.');
    }

    try {
      // 2. 이미 투표했는지 확인 (캐시 레벨 체크)
      const hasVoted = await this.redisClient.get(`${this.VOTED_USER_KEY_PREFIX}${userId}`);
      if (hasVoted) {
        throw new Error('You have already voted.');
      }

      // 3. 투표 처리 (Atomic Transaction)
      // multi()를 사용하여 득표수 증가와 유저 투표 기록을 원자적으로 처리
      const pipeline = this.redisClient.multi();
      
      // Sorted Set: 점수(득표수) 증가 (ZINCRBY)
      pipeline.zincrby(this.LEADERBOARD_KEY, 1, String(restaurantId));
      
      // 유저 투표 기록 저장 (간단히 1일간 유지 등 만료 설정 가능)
      pipeline.set(`${this.VOTED_USER_KEY_PREFIX}${userId}`, 'true', 'EX', 86400);

      await pipeline.exec();

      return true;
    } finally {
      // 4. 락 해제
      await this.redisClient.del(lockKey);
    }
  }

  async getRealtimeRankings() {
    // 득표수 상위 10개 조회 (내림차순)
    // ZREVRANGEBYSCORE 도 가능하지만 ZREVRANGE 가 순위 매기기 용이
    // 결과: ['restaurantId', 'score', 'restaurantId', 'score' ...]
    const rawData = await this.redisClient.zrevrange(this.LEADERBOARD_KEY, 0, 9, 'WITHSCORES');
    
    const rankings = [];
    for (let i = 0; i < rawData.length; i += 2) {
      rankings.push({
        restaurantId: rawData[i],
        votes: parseInt(rawData[i + 1], 10),
      });
    }
    return rankings;
  }
}