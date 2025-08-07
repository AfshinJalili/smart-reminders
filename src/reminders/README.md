# Reminders Module

This module integrates with the notification system to automatically schedule notifications for reminders.

## Features

- **LLM Integration**: Uses AI to generate reminder details from natural language prompts
- **Automatic Notification Scheduling**: Automatically schedules notifications for reminders
- **Timezone Support**: Handles user timezone information
- **Reminder Management**: Cancel and manage scheduled reminders

## API Endpoints

### Create Reminder
```http
POST /reminders
Content-Type: application/json

{
  "userPrompt": "Remind me to call mom tomorrow at 3pm",
  "userTimezone": "America/New_York"
}
```

**Response:**
```json
{
  "title": "Call mom",
  "dateTime": "2024-01-16T15:00:00",
  "notificationId": "reminder-1705431234567-abc123def",
  "scheduledFor": "2024-01-16T15:00:00.000Z"
}
```

### Cancel Reminder
```http
DELETE /reminders/{notificationId}
```

**Response:**
```json
true
```

### Get Scheduled Reminders
```http
GET /reminders/scheduled
```

**Response:**
```json
["reminder-1705431234567-abc123def", "reminder-1705431234568-xyz789ghi"]
```

## How It Works

1. **Reminder Creation**: User provides a natural language prompt describing the reminder
2. **LLM Processing**: The LLM service extracts structured reminder information (title, date/time)
3. **Date Parsing**: The system parses the date/time string and converts it to a proper Date object
4. **Notification Scheduling**: A notification is automatically scheduled using the notification service
5. **Response**: The API returns the reminder details along with the notification ID

## Integration with Notification Service

The reminders service uses the `NotificationsService` to:

- Schedule notifications for reminders
- Cancel scheduled notifications
- Handle notification delivery through various providers (email, SMS, console, etc.)

## Error Handling

- **Date Parsing**: If the LLM returns an unparseable date, the system falls back to scheduling 1 hour from now
- **Notification Failures**: If notification scheduling fails, the error is logged and thrown
- **Provider Issues**: The notification service handles provider availability and fallbacks

## Example Usage

```typescript
// Create a reminder
const reminder = await remindersService.create({
  userPrompt: "Remind me to buy groceries on Friday at 5pm",
  userTimezone: "America/Chicago"
});

// Cancel a reminder
const cancelled = await remindersService.cancelReminder(reminder.notificationId);

// Get all scheduled reminders
const scheduled = await remindersService.getScheduledReminders();
```

## Future Enhancements

- **User Management**: Associate reminders with specific users
- **Recurring Reminders**: Support for daily, weekly, monthly reminders
- **Reminder Categories**: Organize reminders by type (work, personal, etc.)
- **Reminder Templates**: Predefined reminder templates
- **Notification Preferences**: User-specific notification preferences
