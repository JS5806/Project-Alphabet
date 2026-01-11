import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 37.5665 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 126.9780 })
  @IsNumber()
  lon: number;
}