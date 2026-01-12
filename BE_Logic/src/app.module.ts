import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { VotesModule } from './votes/votes.module';
import { User } from './auth/user.entity';
import { Restaurant } from './restaurants/restaurant.entity';
import { VoteSession, VoteOption, VoteRecord } from './votes/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'lunch_vote_db',
      entities: [User, Restaurant, VoteSession, VoteOption, VoteRecord],
      synchronize: true, // MVP 개발 편의를 위해 true (프로덕션에서는 false 권장)
    }),
    AuthModule,
    RestaurantsModule,
    VotesModule,
  ],
})
export class AppModule {}