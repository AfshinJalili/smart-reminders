/**
 * Result of a notification send operation
 */
export interface NotificationResult {
  /**
   * Whether the notification was sent successfully
   */
  success: boolean;

  /**
   * Unique identifier for the notification
   */
  notificationId: string;

  /**
   * Provider that was used to send the notification
   */
  providerId: string;

  /**
   * Timestamp when the notification was sent
   */
  sentAt: Date;

  /**
   * Optional error message if the notification failed
   */
  error?: string;

  /**
   * Optional provider-specific response data
   */
  providerResponse?: any;

  /**
   * Number of recipients the notification was sent to
   */
  recipientCount: number;

  /**
   * Optional delivery status for each recipient
   */
  deliveryStatus?: {
    recipient: string;
    delivered: boolean;
    deliveredAt?: Date;
    error?: string;
  }[];
}
