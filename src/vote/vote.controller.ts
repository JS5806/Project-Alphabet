import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VoteService } from './vote.service';

@Controller('votes')
@UseGuards(AuthGuard('jwt'))
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  async vote(@Req() req, @Body('menuId') menuId: number) {
    return this.voteService.vote(req.user.userId, menuId);
  }

  @Get('results')
  async getResults() {
    return this.voteService.getTodayResults();
  }
}