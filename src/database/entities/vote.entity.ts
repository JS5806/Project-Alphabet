import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Menu } from './menu.entity';

@Entity()
@Unique(['userId', 'voteDate']) // 유저별 1일 1회 투표 제약 (DB 레벨)
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Menu)
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @Column()
  menuId: number;

  @Column({ type: 'date' })
  voteDate: string; // YYYY-MM-DD 형식 저장

  @CreateDateColumn()
  createdAt: Date;
}