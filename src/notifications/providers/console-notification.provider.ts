import { Injectable, Logger } from '@nestjs/common';
import { NotificationProvider } from '../interfaces/notification-provider.interface';
import { NotificationPayload } from '../interfaces/notification-payload.interface';
import { NotificationResult } from '../interfaces/notification-result.interface';

/**
 * Console notification provider for development and testing
 * This provider logs notifications to the console instead of sending them
 */
@Injectable()
export class ConsoleNotificationProvider implements NotificationProvider {
  private readonly logger = new Logger(ConsoleNotificationProvider.name);

  readonly providerId = 'console';
  readonly providerName = 'Console Provider';

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    this.logger.log('=== CONSOLE NOTIFICATION ===');
    this.logger.log(`ID: ${payload.id}`);
    this.logger.log(`Recipients: ${payload.recipients.join(', ')}`);
    this.logger.log(`Subject: ${payload.subject}`);
    this.logger.log(`Content: ${payload.content}`);
    this.logger.log(`Priority: ${payload.priority || 'normal'}`);
    this.logger.log(
      `Scheduled At: ${payload.scheduledAt?.toDateString() || 'immediate'}`,
    );
    this.logger.log(
      `Metadata: ${JSON.stringify(payload.metadata || {}, null, 2)}`,
    );
    this.logger.log('==========================');

    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      success: true,
      notificationId: payload.id,
      providerId: this.providerId,
      sentAt: new Date(),
      recipientCount: payload.recipients.length,
      deliveryStatus: payload.recipients.map((recipient) => ({
        recipient,
        delivered: true,
        deliveredAt: new Date(),
      })),
    };
  }

  async isAvailable(): Promise<boolean> {
    // Mock
    return Promise.resolve(true);
  }

  async validatePayload(payload: NotificationPayload): Promise<boolean> {
    // Mock
    return Promise.resolve(
      !!(
        payload.id &&
        payload.recipients &&
        payload.recipients.length > 0 &&
        payload.subject &&
        payload.content
      ),
    );
  }
}
