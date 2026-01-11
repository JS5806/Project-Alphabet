import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Restaurant')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiOperation({ summary: '식당 등록' })
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '전체 식당 조회' })
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get('nearby')
  @ApiOperation({ summary: '반경(km) 내 식당 검색' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lon', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Default 1km' })
  findNearby(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number = 1,
  ) {
    return this.restaurantService.findNearby(lat, lon, radius);
  }
}