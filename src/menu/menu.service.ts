import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../database/entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.find();
  }

  async create(userId: number, createMenuDto: any): Promise<Menu> {
    const menu = this.menuRepository.create({
      ...createMenuDto,
      authorId: userId,
    });
    return this.menuRepository.save(menu);
  }

  async update(id: number, userId: number, updateDto: any): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) throw new NotFoundException('Menu not found');
    
    // 권한 체크 (본인 작성 또는 관리자 로직 필요)
    
    Object.assign(menu, updateDto);
    return this.menuRepository.save(menu);
  }

  async remove(id: number): Promise<void> {
    await this.menuRepository.delete(id);
  }
}