import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { VoteSession, VoteOption, VoteRecord } from './vote.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(VoteSession)
    private sessionRepo: Repository<VoteSession>,
    @InjectRepository(VoteOption)
    private optionRepo: Repository<VoteOption>,
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    private dataSource: DataSource, // For Transactions
  ) {}

  async createSession(title: string, restaurantIds: number[]): Promise<VoteSession> {
    const session = new VoteSession();
    session.title = title;
    
    // 식당 정보 조회
    const restaurants = await this.restaurantRepo.findByIds(restaurantIds);
    if (restaurants.length === 0) throw new BadRequestException('Invalid restaurants');

    session.options = restaurants.map(r => {
      const option = new VoteOption();
      option.restaurant = r;
      option.voteCount = 0;
      return option;
    });

    return this.sessionRepo.save(session);
  }

  async getSession(id: number): Promise<VoteSession> {
    return this.sessionRepo.findOne({
      where: { id },
      relations: ['options', 'options.restaurant'],
      order: {
        options: { id: 'ASC' }
      }
    });
  }

  async getActiveSessions(): Promise<VoteSession[]> {
    return this.sessionRepo.find({ where: { isActive: true } });
  }

  // 핵심: 데이터 정합성을 위한 트랜잭션 처리
  async castVote(username: string, sessionId: number, optionId: number): Promise<VoteSession> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 유저 조회
      const user = await queryRunner.manager.findOne(User, { where: { username } });
      
      // 2. 이미 투표했는지 확인 (Locking을 걸 수도 있지만, Unique Constraint가 있어서 에러 핸들링으로 처리 가능)
      const existingVote = await queryRunner.manager.findOne(VoteRecord, {
        where: { user: { id: user.id }, session: { id: sessionId } }
      });

      if (existingVote) {
        throw new BadRequestException('You have already voted in this session.');
      }

      // 3. 투표 기록 생성
      const record = new VoteRecord();
      record.user = user;
      record.session = await queryRunner.manager.findOne(VoteSession, { where: { id: sessionId } });
      await queryRunner.manager.save(record);

      // 4. 옵션 카운트 증가 (Atomic Increment)
      await queryRunner.manager.increment(VoteOption, { id: optionId }, 'voteCount', 1);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    // 최신 상태 반환 (Latency 최소화를 위해 DB에서 다시 조회 후 리턴)
    return this.getSession(sessionId);
  }
}