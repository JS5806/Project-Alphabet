import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { VoteModule } from './vote/vote.module';
import { User } from './auth/user.entity';
import { Restaurant } from './restaurant/restaurant.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Docker 사용 시, host machine 기준 접근 또는 서비스명 사용
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'dining_vote',
      entities: [User, Restaurant],
      synchronize: true, // 개발 환경용 (스키마 자동 동기화)
    }),
    AuthModule,
    RestaurantModule,
    VoteModule,
  ],
})
export class AppModule {}