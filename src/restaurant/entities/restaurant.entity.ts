import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // 위도
  @Column({ type: 'double precision' })
  lat: number;

  // 경도
  @Column({ type: 'double precision' })
  lon: number;
}