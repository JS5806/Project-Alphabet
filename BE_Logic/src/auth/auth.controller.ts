import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsString, MinLength } from 'class-validator';

class AuthDto {
  @IsString()
  username: string;
  @IsString()
  @MinLength(6)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: AuthDto) {
    return this.authService.signup(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: AuthDto) {
    return this.authService.login(body.username, body.password);
  }
}