import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private repo: Repository<Restaurant>,
  ) {}

  create(dto: any) {
    const restaurant = this.repo.create(dto);
    return this.repo.save(restaurant);
  }

  findAll() {
    return this.repo.find();
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}