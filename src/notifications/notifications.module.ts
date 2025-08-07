import { Module, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ConsoleNotificationProvider } from './providers/console-notification.provider';
import { InMemoryNotificationScheduler } from './schedulers/in-memory-notification.scheduler';

/**
 * Notifications Module
 *
 * This module provides a comprehensive notification system that is:
 * - Agnostic to notification types (email, SMS, push, etc.)
 * - Extensible through provider interfaces
 * - Capable of scheduling notifications
 * - Supports multiple notification channels
 *
 * The module is designed to be easily extended with new notification providers
 * by implementing the NotificationProvider interface.
 */
@Module({
  imports: [],
  controllers: [],
  providers: [
    NotificationsService,
    ConsoleNotificationProvider,
    InMemoryNotificationScheduler,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule implements OnModuleInit {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly consoleProvider: ConsoleNotificationProvider,
    private readonly scheduler: InMemoryNotificationScheduler,
  ) {}

  onModuleInit() {
    this.notificationsService.registerProvider(this.consoleProvider);
    this.notificationsService.setScheduler(this.scheduler);
  }
}
