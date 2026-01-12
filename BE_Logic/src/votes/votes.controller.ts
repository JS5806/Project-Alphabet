import { Controller, Post, Body, UseGuards, Request, Delete, Get } from '@nestjs/common';
import { VotesService } from './votes.service';
import { AuthGuard } from '@nestjs/passport';
import { IsNumber } from 'class-validator';

class CastVoteDto {
  @IsNumber()
  restaurantId: number;
}

@Controller('votes')
@UseGuards(AuthGuard('jwt'))
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  // 1. Vote (or Change Vote if already voted today)
  @Post()
  async castVote(@Request() req, @Body() dto: CastVoteDto) {
    return this.votesService.castVote(req.user.userId, dto.restaurantId);
  }

  // 2. Cancel Vote
  @Delete()
  async cancelVote(@Request() req) {
    return this.votesService.cancelVote(req.user.userId);
  }

  // 3. Get Current Stats
  @Get('stats')
  async getStats() {
    return this.votesService.getTodayStats();
  }
}