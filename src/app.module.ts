import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { MenusModule } from './menus/menus.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Menu } from './menus/entities/menu.entity';
import { History } from './menus/entities/history.entity';

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({ isGlobal: true }),
    
    // DB 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Menu, History],
        synchronize: true, // 개발 환경용 (운영 시 false 권장)
      }),
      inject: [ConfigService],
    }),

    // Redis & Bull Queue 설정
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),

    // 스케줄러 설정
    ScheduleModule.forRoot(),

    // 기능 모듈
    MenusModule,
    NotificationsModule,
  ],
})
export class AppModule {}