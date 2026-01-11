import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { VoteGateway } from './vote.gateway';
import { Vote } from '../database/entities/vote.entity';
import { Menu } from '../database/entities/menu.entity';
import Redis from 'ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, Menu]),
    ConfigModule,
  ],
  controllers: [VoteController],
  providers: [
    VoteService,
    VoteGateway,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class VoteModule {}