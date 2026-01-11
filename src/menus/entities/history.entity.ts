import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Menu)
  menu: Menu;

  @Column()
  menuId: number;

  @CreateDateColumn()
  eatenAt: Date;
}