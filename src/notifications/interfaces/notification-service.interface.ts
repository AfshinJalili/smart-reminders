import { NotificationPayload } from './notification-payload.interface';
import { NotificationResult } from './notification-result.interface';

/**
 * Information about a notification provider
 */
export type AvailableProviderInfo = {
  id: string;
  name: string;
  available: boolean;
};

/**
 * Main notification service interface
 * Provides a unified API for sending notifications through different providers
 */
export interface NotificationService {
  /**
   * Send a notification immediately using the best available provider
   * @param payload The notification payload
   * @returns Promise that resolves to the notification result
   */
  send(payload: NotificationPayload): Promise<NotificationResult>;

  /**
   * Send a notification using a specific provider
   * @param payload The notification payload
   * @param providerId The ID of the provider to use
   * @returns Promise that resolves to the notification result
   */
  sendWithProvider(
    payload: NotificationPayload,
    providerId: string,
  ): Promise<NotificationResult>;

  /**
   * Schedule a notification to be sent at a specific time
   * @param payload The notification payload with scheduledAt time
   * @returns Promise that resolves to the scheduled notification ID
   */
  schedule(payload: NotificationPayload): Promise<string>;

  /**
   * Cancel a scheduled notification
   * @param notificationId The ID of the notification to cancel
   * @returns Promise that resolves to true if cancellation was successful
   */
  cancelScheduled(notificationId: string): Promise<boolean>;

  /**
   * Get all available notification providers
   * @returns Promise that resolves to an array of provider information
   */
  getAvailableProviders(): Promise<AvailableProviderInfo[]>;

  /**
   * Test a notification provider
   * @param providerId The ID of the provider to test
   * @param testPayload Optional test payload
   * @returns Promise that resolves to the test result
   */
  testProvider(
    providerId: string,
    testPayload?: NotificationPayload,
  ): Promise<NotificationResult>;
}
