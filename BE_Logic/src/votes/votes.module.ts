import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { EventsModule } from '../events/events.module';
import { Restaurant } from '../restaurants/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, Restaurant]),
    EventsModule
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}