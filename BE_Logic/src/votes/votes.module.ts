import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { VotesGateway } from './votes.gateway';
import { VoteSession, VoteOption, VoteRecord } from './vote.entity';
import { AuthModule } from '../auth/auth.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { Restaurant } from '../restaurants/restaurant.entity';
import { JwtModule } from '@nestjs/jwt'; // For WebSocket Auth

@Module({
  imports: [
    TypeOrmModule.forFeature([VoteSession, VoteOption, VoteRecord, Restaurant]),
    AuthModule,
    RestaurantsModule,
    JwtModule.register({
        secret: process.env.JWT_SECRET || 'super_secret_mvp_key',
        signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [VotesController],
  providers: [VotesService, VotesGateway],
})
export class VotesModule {}