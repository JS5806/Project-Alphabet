import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { MenusService } from '../menus/menus.service';

@Injectable()
export class NotificationsScheduler {
  private readonly logger = new Logger(NotificationsScheduler.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly menusService: MenusService,
  ) {}

  // [기능 3] Scheduler를 활용한 점심시간 자동 알림 (평일 오전 11시 30분)
  @Cron('0 30 11 * * 1-5') 
  async handleLunchNotification() {
    this.logger.log('Executing lunch recommendation cron job...');

    try {
      // 1. 추천 메뉴 선정
      const recommendedMenu = await this.menusService.recommendMenu();
      
      // 2. 알림 발송 요청 (Queue에 적재)
      await this.notificationsService.queueLunchNotification(recommendedMenu);

      // 3. 기록 저장 (선택 사항: 추천됨과 동시에 기록할지, 사용자가 확정 후 기록할지에 따라 다름. 여기선 자동 기록)
      await this.menusService.recordHistory(recommendedMenu);
      
    } catch (error) {
      this.logger.error('Failed to schedule lunch notification', error);
    }
  }
}