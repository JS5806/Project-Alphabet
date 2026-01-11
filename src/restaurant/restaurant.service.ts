import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  create(dto: CreateRestaurantDto) {
    const restaurant = this.restaurantRepository.create(dto);
    return this.restaurantRepository.save(restaurant);
  }

  // Haversine Formula (raw SQL) to filter by radius in kilometers
  async findNearby(lat: number, lon: number, radiusKm: number) {
    return this.restaurantRepository
      .createQueryBuilder('restaurant')
      .addSelect(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(restaurant.lat)) * cos(radians(restaurant.lon) - radians(:lon)) + sin(radians(:lat)) * sin(radians(restaurant.lat))))`,
        'distance',
      )
      .where(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(restaurant.lat)) * cos(radians(restaurant.lon) - radians(:lon)) + sin(radians(:lat)) * sin(radians(restaurant.lat)))) <= :radius`,
      )
      .setParameters({ lat, lon, radius: radiusKm })
      .orderBy('distance', 'ASC')
      .getMany();
  }

  findAll() {
    return this.restaurantRepository.find();
  }
}