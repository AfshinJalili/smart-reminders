/**
 * Notification entity for database storage
 */
export class Notification {
  /**
   * Unique identifier for the notification
   */
  id: string;

  /**
   * The recipient(s) of the notification
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
   * Priority level for the notification
   */
  priority: 'low' | 'normal' | 'high' | 'urgent';

  /**
   * Provider that was used to send the notification
   */
  providerId: string;

  /**
   * Current status of the notification
   */
  status: 'pending' | 'scheduled' | 'sent' | 'failed' | 'cancelled';

  /**
   * When the notification was scheduled to be sent
   */
  scheduledAt?: Date;

  /**
   * When the notification was actually sent
   */
  sentAt?: Date;

  /**
   * When the notification expires
   */
  expiresAt?: Date;

  /**
   * Number of retry attempts
   */
  retryCount: number;

  /**
   * Maximum number of retry attempts
   */
  maxRetries: number;

  /**
   * Error message if the notification failed
   */
  error?: string;

  /**
   * Provider-specific response data
   */
  providerResponse?: any;

  /**
   * Metadata for the notification
   */
  metadata?: Record<string, any>;

  /**
   * When the notification was created
   */
  createdAt: Date;

  /**
   * When the notification was last updated
   */
  updatedAt: Date;
}
