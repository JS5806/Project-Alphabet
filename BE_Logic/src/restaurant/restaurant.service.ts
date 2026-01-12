import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create(data);
    return this.restaurantRepository.save(restaurant);
  }

  async updateRestaurant(id: number, data: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException(`Restaurant with ID ${id} not found`);
    
    Object.assign(restaurant, data);
    return this.restaurantRepository.save(restaurant);
  }

  async deleteRestaurant(id: number): Promise<void> {
    const result = await this.restaurantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
  }
}