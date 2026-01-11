import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Processor('slack-notification')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // [기능 3 & Team Comment] Queue에서 작업을 꺼내 실제 Webhook 발송 (Consumer)
  @Process('send-lunch-menu')
  async handleSendLunchMenu(job: Job) {
    const { menuName, category } = job.data;
    const webhookUrl = this.configService.get<string>('SLACK_WEBHOOK_URL');

    this.logger.debug(`Sending slack notification for: ${menuName}`);

    if (!webhookUrl) {
        this.logger.warn('SLACK_WEBHOOK_URL is not defined.');
        return;
    }

    try {
      // Slack 메시지 포맷
      const message = {
        text: `📢 오늘의 점심 추천 메뉴가 도착했습니다!`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*오늘의 메뉴:* ${menuName}\n*카테고리:* ${category}\n\n맛있는 점심 되세요! 😋`
            }
          }
        ]
      };

      // 실제 API 호출 (비동기적으로 처리됨)
      await lastValueFrom(this.httpService.post(webhookUrl, message));
      
      this.logger.log(`Notification sent successfully for job ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to send notification for job ${job.id}`, error.message);
      throw error; // 에러를 던져야 Bull이 재시도(Retry) 로직을 수행함
    }
  }
}