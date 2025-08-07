# Notifications Module

This module provides a comprehensive notification system that is agnostic to notification types and easily extensible.

## Architecture

The notification system is built around several key interfaces:

### Core Interfaces

1. **NotificationProvider** - Base interface for all notification providers (email, SMS, push, etc.)
2. **NotificationPayload** - Contains all data needed to send a notification
3. **NotificationResult** - Result structure after sending a notification
4. **NotificationScheduler** - Handles scheduling and managing scheduled notifications
5. **NotificationService** - Main service interface that orchestrates the notification system

### Key Features

- **Provider Agnostic**: The system doesn't care about the type of notification (email, SMS, push, etc.)
- **Extensible**: Easy to add new notification providers by implementing the `NotificationProvider` interface
- **Scheduling**: Support for scheduling notifications to be sent at specific times
- **Retry Logic**: Built-in retry mechanism for failed notifications
- **Priority Levels**: Support for different priority levels (low, normal, high, urgent)
- **Metadata Support**: Flexible metadata system for provider-specific data

## Adding a New Notification Provider

To add a new notification provider (e.g., email, SMS, push notifications):

1. Create a new provider class that implements `NotificationProvider`
2. Register the provider in the module
3. The system will automatically use the new provider

### Example Provider Implementation

```typescript
import { Injectable } from '@nestjs/common';
import { NotificationProvider, NotificationPayload, NotificationResult } from './interfaces';

@Injectable()
export class EmailNotificationProvider implements NotificationProvider {
  readonly providerId = 'email';
  readonly providerName = 'Email Provider';

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    // Implementation for sending email
  }

  async isAvailable(): Promise<boolean> {
    // Check if email service is configured
  }

  async validatePayload(payload: NotificationPayload): Promise<boolean> {
    // Validate email-specific requirements
  }
}
```

## Usage Examples

### Using the NotificationsService in Other Modules

```typescript
import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationPayload } from './notifications/interfaces';

@Injectable()
export class MyService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async sendReminder(userEmail: string, message: string): Promise<void> {
    const payload: NotificationPayload = {
      id: `reminder-${Date.now()}`,
      recipients: [userEmail],
      subject: 'Reminder',
      content: message,
      priority: 'normal'
    };

    const result = await this.notificationsService.send(payload);
    
    if (!result.success) {
      throw new Error(`Failed to send notification: ${result.error}`);
    }
  }

  async scheduleNotification(userEmail: string, scheduledTime: Date): Promise<string> {
    const payload: NotificationPayload = {
      id: `scheduled-${Date.now()}`,
      recipients: [userEmail],
      subject: 'Scheduled Notification',
      content: 'This is a scheduled notification',
      scheduledAt: scheduledTime,
      priority: 'high'
    };

    return await this.notificationsService.schedule(payload);
  }
}
```

### Sending an Immediate Notification

```typescript
const payload: NotificationPayload = {
  id: 'unique-id',
  recipients: ['user@example.com'],
  subject: 'Reminder',
  content: 'Don\'t forget your meeting at 2 PM',
  priority: 'normal'
};

const result = await notificationService.send(payload);
```

### Scheduling a Notification

```typescript
const payload: NotificationPayload = {
  id: 'unique-id',
  recipients: ['user@example.com'],
  subject: 'Meeting Reminder',
  content: 'Your meeting starts in 30 minutes',
  scheduledAt: new Date('2024-01-15T14:00:00Z'),
  priority: 'high'
};

const scheduledId = await notificationService.schedule(payload);
```

## Module Structure

```
notifications/
├── interfaces/
│   ├── notification-provider.interface.ts
│   ├── notification-payload.interface.ts
│   ├── notification-result.interface.ts
│   ├── notification-scheduler.interface.ts
│   ├── notification-service.interface.ts
│   └── index.ts
├── entities/
│   └── notification.entity.ts
├── dto/
│   ├── create-notification.dto.ts
│   └── schedule-notification.dto.ts
├── providers/
│   └── (provider implementations)
├── notifications.module.ts
└── README.md
```

## Future Extensions

- Database integration for persistent storage
- Webhook support for real-time notifications
- Template system for notification content
- Analytics and reporting
- Rate limiting and throttling
- Multi-language support 