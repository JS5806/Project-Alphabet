import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VoteModule } from './vote/vote.module';
import { User } from './entities/user.entity';
import { Vote } from './entities/vote.entity';
import { VoteOption } from './entities/vote-option.entity';
import { VoteHistory } from './entities/vote-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Vote, VoteOption, VoteHistory],
      synchronize: true, // MVP 개발 편의상 true (프로덕션에서는 false 권장)
      logging: false,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 60, // 기본 캐시 60초
    }),
    AuthModule,
    VoteModule,
  ],
})
export class AppModule {}