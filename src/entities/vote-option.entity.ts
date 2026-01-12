import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vote } from './vote.entity';

@Entity()
export class VoteOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ default: 0 })
  count: number;

  @ManyToOne(() => Vote, (vote) => vote.options)
  vote: Vote;
}