import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Vote } from './vote.entity';
import { EventsGateway } from '../events/events.gateway';
import { Restaurant } from '../restaurants/restaurant.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    @InjectRepository(Restaurant) private restaurantRepo: Repository<Restaurant>,
    private eventsGateway: EventsGateway,
  ) {}

  private getTodayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  async castVote(userId: number, restaurantId: number) {
    const { start, end } = this.getTodayRange();

    // Check if restaurant exists
    const restaurant = await this.restaurantRepo.findOne({ where: { id: restaurantId }});
    if(!restaurant) throw new BadRequestException('Restaurant not found');

    // Check if user already voted today
    let vote = await this.voteRepo.findOne({
      where: {
        userId,
        createdAt: Between(start, end),
      },
    });

    if (vote) {
      // Update existing vote (Change logic)
      vote.restaurantId = restaurantId;
    } else {
      // Create new vote
      vote = this.voteRepo.create({
        userId,
        restaurantId,
      });
    }

    await this.voteRepo.save(vote);
    await this.broadcastStats(); // Real-time update
    return { message: 'Vote cast successfully' };
  }

  async cancelVote(userId: number) {
    const { start, end } = this.getTodayRange();
    
    const vote = await this.voteRepo.findOne({
      where: { userId, createdAt: Between(start, end) },
    });

    if (!vote) throw new BadRequestException('No vote found for today');

    await this.voteRepo.remove(vote);
    await this.broadcastStats(); // Real-time update
    return { message: 'Vote cancelled' };
  }

  async getTodayStats() {
    const { start, end } = this.getTodayRange();

    // Aggregation Query
    const results = await this.voteRepo
      .createQueryBuilder('vote')
      .select('vote.restaurantId', 'restaurantId')
      .addSelect('COUNT(vote.id)', 'count')
      .leftJoinAndSelect('vote.restaurant', 'restaurant') // Join to get name
      .where('vote.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('vote.restaurantId')
      .addGroupBy('restaurant.id') // Postgres requirement
      .getRawMany();

    // Format for client
    return results.map(r => ({
      restaurantId: r.restaurantId,
      restaurantName: r.restaurant_name,
      count: parseInt(r.count, 10)
    }));
  }

  private async broadcastStats() {
    const stats = await this.getTodayStats();
    this.eventsGateway.broadcastVoteUpdate(stats);
  }
}