import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VoteSession } from './vote-session.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

@Entity()
export class VoteOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: number;

  @Column()
  restaurantId: number;

  @ManyToOne(() => VoteSession, (session) => session.options)
  @JoinColumn({ name: 'sessionId' })
  session: VoteSession;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @Column({ default: 0 })
  voteCount: number;
}