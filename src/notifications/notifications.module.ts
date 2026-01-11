import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsScheduler } from './notifications.scheduler';
import { MenusModule } from '../menus/menus.module';

@Module({
  imports: [
    // [Team Comment] 비동기 처리를 위한 Queue 등록
    BullModule.registerQueue({
      name: 'slack-notification',
    }),
    HttpModule, // Webhook 호출용 axios 래퍼
    MenusModule, // 메뉴 추천 로직 사용
  ],
  providers: [
    NotificationsService, 
    NotificationsProcessor, 
    NotificationsScheduler
  ],
})
export class NotificationsModule {}