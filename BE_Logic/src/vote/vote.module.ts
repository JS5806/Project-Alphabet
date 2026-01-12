import { Module } from '@nestjs/common';
import { VoteGateway } from './vote.gateway';
import { VoteService } from './vote.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    // Gateway에서 JWT 검증을 위해 필요
    JwtModule.register({
      secret: 'secretKey123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [VoteGateway, VoteService],
})
export class VoteModule {}