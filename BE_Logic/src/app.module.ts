import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { VotesModule } from './votes/votes.module';
import { EventsModule } from './events/events.module';
import { User } from './users/user.entity';
import { Restaurant } from './restaurants/restaurant.entity';
import { Vote } from './votes/vote.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Restaurant, Vote],
      synchronize: true, // MVP Only: Auto schema sync
    }),
    AuthModule,
    RestaurantsModule,
    VotesModule,
    EventsModule,
  ],
})
export class AppModule {}