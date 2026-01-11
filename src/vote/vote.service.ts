import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Vote } from '../database/entities/vote.entity';
import { Menu } from '../database/entities/menu.entity';
import { VoteGateway } from './vote.gateway';
import Redis from 'ioredis';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private voteGateway: VoteGateway,
    private dataSource: DataSource,
  ) {}

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // [핵심 로직] Redis를 활용한 투표 및 결과 집계
  async vote(userId: number, menuId: number) {
    const today = this.getTodayDateString();
    const redisUserVoteKey = `vote:user:${today}:${userId}`;
    const redisMenuCountKey = `vote:count:${today}:${menuId}`;

    // 1. Redis 캐시 확인 (빠른 거절)
    const hasVoted = await this.redis.get(redisUserVoteKey);
    if (hasVoted) {
      throw new BadRequestException('이미 오늘 투표를 완료했습니다.');
    }

    // 2. DB 트랜잭션 (데이터 무결성 보장)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2-1. DB 중복 체크 (Double Check)
      const existingVote = await queryRunner.manager.findOne(Vote, {
        where: { userId, voteDate: today },
      });
      
      if (existingVote) {
        throw new BadRequestException('이미 오늘 투표를 완료했습니다.');
      }

      // 2-2. 투표 저장
      const vote = queryRunner.manager.create(Vote, {
        userId,
        menuId,
        voteDate: today,
      });
      await queryRunner.manager.save(vote);

      // 2-3. Redis 업데이트 (원자적 연산)
      await this.redis.set(redisUserVoteKey, '1', 'EX', 86400); // 24시간 만료
      await this.redis.incr(redisMenuCountKey);
      
      await queryRunner.commitTransaction();

      // 3. 실시간 결과 전송 (비동기 처리)
      this.broadcastCurrentStatus(today);

      return { success: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getTodayResults() {
    const today = this.getTodayDateString();
    return this.getResultsFromRedis(today);
  }

  private async getResultsFromRedis(date: string) {
    // 메뉴 목록 가져오기
    const menus = await this.menuRepository.find();
    
    // Redis에서 각 메뉴의 카운트 조회 (Pipeline으로 최적화)
    const pipeline = this.redis.pipeline();
    menus.forEach(menu => {
      pipeline.get(`vote:count:${date}:${menu.id}`);
    });
    
    const results = await pipeline.exec();
    
    // 결과 매핑
    return menus.map((menu, index) => ({
      menuId: menu.id,
      name: menu.name,
      count: parseInt((results[index][1] as string) || '0', 10),
    })).sort((a, b) => b.count - a.count);
  }

  private async broadcastCurrentStatus(date: string) {
    const results = await this.getResultsFromRedis(date);
    this.voteGateway.broadcastVoteUpdate(results);
  }
}