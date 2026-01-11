import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Menu } from '../menus/entities/menu.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('slack-notification') private notificationQueue: Queue
  ) {}

  // [Team Comment] Message Queue에 작업 추가 (Producer)
  async queueLunchNotification(menu: Menu) {
    await this.notificationQueue.add('send-lunch-menu', {
      menuName: menu.name,
      category: menu.category,
      timestamp: new Date(),
    }, {
      attempts: 3, // 실패 시 3회 재시도
      backoff: 1000, // 재시도 간격
      removeOnComplete: true,
    });
  }
}