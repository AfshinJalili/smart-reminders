import { Injectable, Logger } from '@nestjs/common';
import { NotificationScheduler } from '../interfaces/notification-scheduler.interface';
import { NotificationPayload } from '../interfaces/notification-payload.interface';

/**
 * In-memory notification scheduler for development and testing
 * This scheduler stores scheduled notifications in memory
 */
@Injectable()
export class InMemoryNotificationScheduler implements NotificationScheduler {
  private readonly logger = new Logger(InMemoryNotificationScheduler.name);
  private scheduledNotifications: Map<string, NotificationPayload> = new Map();

  async schedule(payload: NotificationPayload): Promise<string> {
    if (!payload.scheduledAt) {
      throw new Error('Scheduled time is required');
    }

    const notificationId = payload.id;
    this.scheduledNotifications.set(notificationId, payload);

    this.logger.log(
      `Scheduled notification: ${notificationId} for ${payload.scheduledAt.toISOString()}`,
    );

    return Promise.resolve(notificationId);
  }

  async cancel(notificationId: string): Promise<boolean> {
    const cancelled = this.scheduledNotifications.delete(notificationId);

    if (cancelled) {
      this.logger.log(`Cancelled scheduled notification: ${notificationId}`);
    } else {
      this.logger.warn(
        `Failed to cancel notification: ${notificationId} (not found)`,
      );
    }

    return Promise.resolve(cancelled);
  }

  async update(
    notificationId: string,
    payload: NotificationPayload,
  ): Promise<boolean> {
    if (!this.scheduledNotifications.has(notificationId)) {
      return Promise.resolve(false);
    }

    this.scheduledNotifications.set(notificationId, payload);
    this.logger.log(`Updated scheduled notification: ${notificationId}`);

    return Promise.resolve(true);
  }

  async getScheduledNotifications(): Promise<string[]> {
    return Promise.resolve(Array.from(this.scheduledNotifications.keys()));
  }

  async getScheduledNotification(
    notificationId: string,
  ): Promise<NotificationPayload | null> {
    return Promise.resolve(
      this.scheduledNotifications.get(notificationId) || null,
    );
  }

  async processDueNotifications(): Promise<number> {
    const now = new Date();
    const dueNotifications: string[] = [];

    // Find all due notifications
    for (const [id, payload] of this.scheduledNotifications.entries()) {
      if (payload.scheduledAt && payload.scheduledAt <= now) {
        dueNotifications.push(id);
      }
    }

    this.logger.log(`Found ${dueNotifications.length} due notifications`);

    // Remove due notifications from the map
    for (const id of dueNotifications) {
      this.scheduledNotifications.delete(id);
    }

    return Promise.resolve(dueNotifications.length);
  }

  /**
   * Get all scheduled notifications with their details
   * This is useful for debugging and monitoring
   */
  getAllScheduledNotifications(): Map<string, NotificationPayload> {
    return new Map(this.scheduledNotifications);
  }
}
