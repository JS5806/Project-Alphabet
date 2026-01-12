import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

// 동일 유저가 동일 투표에 중복 참여 방지
@Entity()
@Unique(['userId', 'voteId'])
export class VoteHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  voteId: string;

  @Column()
  optionId: string;

  @CreateDateColumn()
  votedAt: Date;
}