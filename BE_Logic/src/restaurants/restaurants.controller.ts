import { Controller, Get, Post, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './restaurant.entity';

@Controller('restaurants')
@UseGuards(AuthGuard())
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantsService.getAllRestaurants();
  }

  @Get('/:id')
  getRestaurantById(@Param('id') id: number): Promise<Restaurant> {
    return this.restaurantsService.getRestaurantById(id);
  }

  @Post()
  createRestaurant(@Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantsService.createRestaurant(createRestaurantDto);
  }
}