import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { VoteModule } from './vote/vote.module';
import { User } from './database/entities/user.entity';
import { Menu } from './database/entities/menu.entity';
import { Vote } from './database/entities/vote.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Menu, Vote],
        synchronize: true, // 개발 환경용 (프로덕션에서는 false 권장)
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MenuModule,
    VoteModule,
  ],
})
export class AppModule {}