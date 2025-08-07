import { NotificationPayload } from './notification-payload.interface';
import { NotificationResult } from './notification-result.interface';

/**
 * Base interface for all notification providers
 * This makes the notification system agnostic to the type of notification
 */
export interface NotificationProvider {
  /**
   * Unique identifier for the provider
   */
  readonly providerId: string;

  /**
   * Human-readable name for the provider
   */
  readonly providerName: string;

  /**
   * Send a notification using this provider
   * @param payload The notification payload containing all necessary data
   * @returns Promise that resolves to the notification result
   */
  send(payload: NotificationPayload): Promise<NotificationResult>;

  /**
   * Check if this provider is available/configured
   * @returns Promise that resolves to true if provider is available
   */
  isAvailable(): Promise<boolean>;

  /**
   * Validate if the payload is compatible with this provider
   * @param payload The notification payload to validate
   * @returns Promise that resolves to true if payload is valid for this provider
   */
  validatePayload(payload: NotificationPayload): Promise<boolean>;
}
