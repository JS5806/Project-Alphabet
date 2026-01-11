import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // [기능 2] 카테고리별 조회를 위한 DB 인덱싱
  @Index() 
  @Column()
  category: string; // 한식, 중식, 일식 등

  @Column({ default: 1 })
  preference: number; // 선호도 가중치 (1~10)

  @CreateDateColumn()
  createdAt: Date;
}