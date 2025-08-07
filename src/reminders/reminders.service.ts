import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from 'src/llm/llm.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { NotificationPayload } from 'src/notifications/interfaces/notification-payload.interface';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createReminderDto: CreateReminderDto) {
    const reminder = await this.llmService.generateReminder(createReminderDto);

    const reminderDateTime = this.parseReminderDateTime(reminder.dateTime);

    const notificationId = await this.scheduleReminderNotification(
      reminder,
      reminderDateTime,
    );

    return {
      ...reminder,
      notificationId,
      scheduledFor: reminderDateTime.toISOString(),
    };
  }

  /**
   * Schedule a notification for a reminder
   */
  private async scheduleReminderNotification(
    reminder: { title: string; dateTime: Date | string },
    scheduledTime: Date,
  ): Promise<string> {
    const payload: NotificationPayload = {
      id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      recipients: ['user@example.com'], // TODO: Get from user context
      subject: 'Reminder',
      content: `Reminder: ${reminder.title}`,
      scheduledAt: scheduledTime,
      priority: 'normal',
      metadata: {
        type: 'reminder',
        originalPrompt: reminder.title,
        reminderDateTime: reminder.dateTime,
      },
    };

    this.logger.log(`Scheduling notification for reminder: ${reminder.title}`);
    return await this.notificationsService.schedule(payload);
  }

  /**
   * Parse reminder date and time string into a Date object
   * This is a simple implementation - in production, you might want more sophisticated parsing
   */
  private parseReminderDateTime(dateTimeString: string | Date): Date {
    try {
      if (dateTimeString instanceof Date) {
        return dateTimeString;
      }

      if (
        typeof dateTimeString === 'string' &&
        (dateTimeString.includes('T') || dateTimeString.includes('Z'))
      ) {
        return new Date(dateTimeString);
      }

      const parsedDate = new Date(dateTimeString);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }

      this.logger.warn(
        `Could not parse date time: ${dateTimeString}, scheduling for 1 hour from now`,
      );
      const fallbackDate = new Date();
      fallbackDate.setHours(fallbackDate.getHours() + 1);
      return fallbackDate;
    } catch (error) {
      this.logger.error(
        `Error parsing date time: ${dateTimeString instanceof Date ? dateTimeString.toISOString() : dateTimeString}`,
        error,
      );

      const fallbackDate = new Date();
      fallbackDate.setHours(fallbackDate.getHours() + 1);
      return fallbackDate;
    }
  }
}
