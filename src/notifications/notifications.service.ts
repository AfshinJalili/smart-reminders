import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  AvailableProviderInfo,
  NotificationService,
} from './interfaces/notification-service.interface';
import { NotificationProvider } from './interfaces/notification-provider.interface';
import { NotificationPayload } from './interfaces/notification-payload.interface';
import { NotificationResult } from './interfaces/notification-result.interface';
import { NotificationScheduler } from './interfaces/notification-scheduler.interface';

@Injectable()
export class NotificationsService implements NotificationService, OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private providers: Map<string, NotificationProvider> = new Map();
  private scheduler: NotificationScheduler;

  constructor() {
    this.logger.log('NotificationsService initialized');
  }

  async onModuleInit() {
    await Promise.resolve();
    this.logger.log('NotificationsService module initialized');
  }

  /**
   * Register a notification provider
   * @param provider The notification provider to register
   */
  registerProvider(provider: NotificationProvider): void {
    this.providers.set(provider.providerId, provider);
    this.logger.log(
      `Registered notification provider: ${provider.providerName} (${provider.providerId})`,
    );
  }

  /**
   * Set the notification scheduler
   * @param scheduler The notification scheduler to use
   */
  setScheduler(scheduler: NotificationScheduler): void {
    this.scheduler = scheduler;
    this.logger.log('Notification scheduler set');
  }

  /**
   * Send a notification immediately using the best available provider
   */
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    this.logger.log(`Sending notification: ${payload.id}`);

    try {
      const provider = await this.selectBestProvider(payload);
      if (!provider) {
        throw new Error('No available notification providers');
      }

      return await this.sendWithProvider(payload, provider.providerId);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${payload.id}`, error);
      return this.createErrorResult(payload, error);
    }
  }

  /**
   * Send a notification using a specific provider
   */
  async sendWithProvider(
    payload: NotificationPayload,
    providerId: string,
  ): Promise<NotificationResult> {
    this.logger.log(
      `Sending notification: ${payload.id} with provider: ${providerId}`,
    );

    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`);
    }

    try {
      const isAvailable = await provider.isAvailable();
      if (!isAvailable) {
        throw new Error(`Provider not available: ${providerId}`);
      }

      const isValid = await provider.validatePayload(payload);
      if (!isValid) {
        throw new Error(`Invalid payload for provider: ${providerId}`);
      }

      const result = await provider.send(payload);

      this.logger.log(
        `Notification sent successfully: ${payload.id} via ${providerId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send notification: ${payload.id} via ${providerId}`,
        error instanceof Error ? error.stack : String(error),
      );
      return this.createErrorResult(
        payload,
        error instanceof Error ? error.message : String(error),
        providerId,
      );
    }
  }

  /**
   * Schedule a notification to be sent at a specific time
   */
  async schedule(payload: NotificationPayload): Promise<string> {
    if (!payload.scheduledAt) {
      throw new Error(
        'Scheduled time is required for scheduling notifications',
      );
    }

    if (!this.scheduler) {
      throw new Error('Notification scheduler not configured');
    }

    this.logger.log(
      `Scheduling notification: ${payload.id} for ${payload.scheduledAt.toISOString()}`,
    );

    try {
      const scheduledId = await this.scheduler.schedule(payload);
      this.logger.log(`Notification scheduled successfully: ${scheduledId}`);
      return scheduledId;
    } catch (error) {
      this.logger.error(
        `Failed to schedule notification: ${payload.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelScheduled(notificationId: string): Promise<boolean> {
    if (!this.scheduler) {
      throw new Error('Notification scheduler not configured');
    }

    this.logger.log(`Cancelling scheduled notification: ${notificationId}`);

    try {
      const cancelled = await this.scheduler.cancel(notificationId);
      if (cancelled) {
        this.logger.log(
          `Scheduled notification cancelled successfully: ${notificationId}`,
        );
      } else {
        this.logger.warn(
          `Failed to cancel scheduled notification: ${notificationId}`,
        );
      }
      return cancelled;
    } catch (error) {
      this.logger.error(
        `Error cancelling scheduled notification: ${notificationId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async getAvailableProviders(): Promise<AvailableProviderInfo[]> {
    const providers: AvailableProviderInfo[] = [];

    for (const [id, provider] of this.providers) {
      const available = await provider.isAvailable();
      providers.push({
        id,
        name: provider.providerName,
        available,
      });
    }

    return providers;
  }

  /**
   * Test a notification provider
   */
  async testProvider(
    providerId: string,
    testPayload?: NotificationPayload,
  ): Promise<NotificationResult> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`);
    }

    // Create a test payload if none provided
    const payload = testPayload || {
      id: `test-${Date.now()}`,
      recipients: ['test@example.com'],
      subject: 'Test Notification',
      content: 'This is a test notification',
      priority: 'normal',
    };

    this.logger.log(`Testing provider: ${providerId}`);

    try {
      const result = await this.sendWithProvider(payload, providerId);
      this.logger.log(`Provider test successful: ${providerId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Provider test failed: ${providerId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Select the best available provider for the given payload
   */
  private async selectBestProvider(
    payload: NotificationPayload,
  ): Promise<NotificationProvider | null> {
    const availableProviders: NotificationProvider[] = [];

    // Check all providers for availability
    for (const provider of this.providers.values()) {
      try {
        const isAvailable = await provider.isAvailable();
        const isValid = await provider.validatePayload(payload);

        if (isAvailable && isValid) {
          availableProviders.push(provider);
        }
      } catch (error) {
        this.logger.warn(
          `Provider check failed: ${provider.providerId}`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    if (availableProviders.length === 0) {
      return null;
    }

    return availableProviders[0];
  }

  /**
   * Create an error result for failed notifications
   */
  private createErrorResult(
    payload: NotificationPayload,
    error: string,
    providerId?: string,
  ): NotificationResult {
    return {
      success: false,
      notificationId: payload.id,
      providerId: providerId || 'unknown',
      sentAt: new Date(),
      error,
      recipientCount: payload.recipients.length,
    };
  }
}
