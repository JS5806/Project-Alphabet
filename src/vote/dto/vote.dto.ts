import { IsString, IsArray, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: '오늘 점심 어디갈까요?' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: [1, 2, 3], description: 'List of Restaurant IDs' })
  @IsArray()
  @IsNumber({}, { each: true })
  restaurantIds: number[];
}

export class CastVoteDto {
  @ApiProperty({ example: 1, description: 'Vote Option ID (Not Restaurant ID)' })
  @IsNumber()
  optionId: number;
}