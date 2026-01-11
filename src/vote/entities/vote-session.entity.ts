import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { VoteOption } from './vote-option.entity';

@Entity()
export class VoteSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  creatorId: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => VoteOption, (option) => option.session, { cascade: true })
  options: VoteOption[];

  @CreateDateColumn()
  createdAt: Date;
}