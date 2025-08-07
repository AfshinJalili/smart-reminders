/**
 * Base interface for notification payload
 * Contains all necessary data to send a notification
 */
export interface NotificationPayload {
  /**
   * Unique identifier for the notification
   */
  id: string;

  /**
   * The recipient(s) of the notification
   * Format depends on the provider (email address, phone number, user ID, etc.)
   */
  recipients: string[];

  /**
   * The subject/title of the notification
   */
  subject: string;

  /**
   * The main content/body of the notification
   */
  content: string;

  /**
   * Optional priority level for the notification
   */
  priority?: 'low' | 'normal' | 'high' | 'urgent';

  /**
   * Optional metadata for the notification
   * Can contain provider-specific data
   */
  metadata?: Record<string, any>;

  /**
   * Optional scheduled time for the notification
   * If not provided, notification will be sent immediately
   */
  scheduledAt?: Date;

  /**
   * Optional expiration time for the notification
   */
  expiresAt?: Date;

  /**
   * Optional retry configuration
   */
  retryConfig?: {
    maxRetries: number;
    retryDelay: number; // in milliseconds
  };
}
