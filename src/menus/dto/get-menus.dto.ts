import { IsOptional, IsString } from 'class-validator';

export class GetMenusDto {
  @IsOptional()
  @IsString()
  category?: string;
}