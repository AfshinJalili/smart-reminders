import { NotificationPayload } from './notification-payload.interface';

/**
 * Interface for scheduling and managing scheduled notifications
 */
export interface NotificationScheduler {
  /**
   * Schedule a notification to be sent at a specific time
   * @param payload The notification payload to schedule
   * @returns Promise that resolves to the scheduled notification ID
   */
  schedule(payload: NotificationPayload): Promise<string>;

  /**
   * Cancel a scheduled notification
   * @param notificationId The ID of the notification to cancel
   * @returns Promise that resolves to true if cancellation was successful
   */
  cancel(notificationId: string): Promise<boolean>;

  /**
   * Update a scheduled notification
   * @param notificationId The ID of the notification to update
   * @param payload The updated notification payload
   * @returns Promise that resolves to true if update was successful
   */
  update(
    notificationId: string,
    payload: NotificationPayload,
  ): Promise<boolean>;

  /**
   * Get all scheduled notifications
   * @returns Promise that resolves to an array of scheduled notification IDs
   */
  getScheduledNotifications(): Promise<string[]>;

  /**
   * Get details of a specific scheduled notification
   * @param notificationId The ID of the notification
   * @returns Promise that resolves to the notification payload or null if not found
   */
  getScheduledNotification(
    notificationId: string,
  ): Promise<NotificationPayload | null>;

  /**
   * Process all due notifications
   * This method should be called by a scheduler/cron job
   * @returns Promise that resolves to the number of notifications processed
   */
  processDueNotifications(): Promise<number>;
}
