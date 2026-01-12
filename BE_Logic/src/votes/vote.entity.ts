import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../auth/user.entity';

@Entity()
export class VoteSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => VoteOption, (option) => option.session, { cascade: true })
  options: VoteOption[];
}

@Entity()
export class VoteOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VoteSession, (session) => session.options, { onDelete: 'CASCADE' })
  session: VoteSession;

  @ManyToOne(() => Restaurant, { eager: true })
  restaurant: Restaurant;

  @Column({ default: 0 })
  voteCount: number;
}

@Entity()
@Unique(['user', 'session']) // 한 유저는 세션당 한 번만 투표 가능 (데이터 정합성)
export class VoteRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => VoteSession)
  session: VoteSession;

  @CreateDateColumn()
  votedAt: Date;
}