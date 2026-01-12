import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class GuestLoginDto {
  @ApiProperty({ description: 'Unique Device ID or IP Address' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}