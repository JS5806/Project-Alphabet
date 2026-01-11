import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

// 중복 투표 방지를 위한 기록 테이블
@Entity()
@Unique(['userId', 'sessionId']) // 한 사용자는 한 세션에 한 번만 투표 가능
export class VoteRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  sessionId: number;
}