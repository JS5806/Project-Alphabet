import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password?: string; // OAuth 사용 시 nullable 가능하지만 여기선 로컬 로그인 병행

  @Column({ default: 'user' })
  role: string;
}