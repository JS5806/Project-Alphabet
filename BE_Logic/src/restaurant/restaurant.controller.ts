import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('restaurants')
@UseGuards(AuthGuard())
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get()
  getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAllRestaurants();
  }

  @Post()
  createRestaurant(@Body() body: Partial<Restaurant>): Promise<Restaurant> {
    return this.restaurantService.createRestaurant(body);
  }

  @Put('/:id')
  updateRestaurant(@Param('id') id: number, @Body() body: Partial<Restaurant>): Promise<Restaurant> {
    return this.restaurantService.updateRestaurant(id, body);
  }

  @Delete('/:id')
  deleteRestaurant(@Param('id') id: number): Promise<void> {
    return this.restaurantService.deleteRestaurant(id);
  }
}