import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VotesService } from './votes.service';

@Controller('votes')
@UseGuards(AuthGuard())
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post('/session')
  createSession(@Body('title') title: string, @Body('restaurantIds') restaurantIds: number[]) {
    return this.votesService.createSession(title, restaurantIds);
  }

  @Get('/session/:id')
  getSession(@Param('id') id: number) {
    return this.votesService.getSession(id);
  }

  @Get('/sessions')
  getActiveSessions() {
    return this.votesService.getActiveSessions();
  }
}