import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  async getRestaurantById(id: number): Promise<Restaurant> {
    const found = await this.restaurantRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Restaurant with ID "${id}" not found`);
    }
    return found;
  }

  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const { name, category, description } = createRestaurantDto;
    const restaurant = this.restaurantRepository.create({ name, category, description });
    await this.restaurantRepository.save(restaurant);
    return restaurant;
  }
}