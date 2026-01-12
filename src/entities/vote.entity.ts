import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { VoteOption } from './vote-option.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  deadLine: Date;

  @OneToMany(() => VoteOption, (option) => option.vote, { cascade: true })
  options: VoteOption[];

  @CreateDateColumn()
  createdAt: Date;
}