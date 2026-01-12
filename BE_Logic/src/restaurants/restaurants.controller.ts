import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsOptional } from 'class-validator';

class CreateRestaurantDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
}

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'))
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}