import { Logger } from '@nestjs/common';

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number; // in milliseconds
  maxDelay: number; // in milliseconds
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

const retryableStatuses = [408, 429, 500, 502, 503, 504];

const retryableCodes = [
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'ENETUNREACH',
  'rate_limit_exceeded',
  'insufficient_quota',
  'server_error',
  'service_unavailable',
];

const retryableTypes = ['server_error', 'rate_limit_exceeded'];

export function isRetryableError(error: any): boolean {
  if (error?.code) {
    return retryableCodes.includes(error.code);
  }

  if (error?.status) {
    return retryableStatuses.includes(error.status);
  }

  if (error?.type) {
    return retryableTypes.includes(error.type);
  }

  return false;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  logger?: Logger,
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (!isRetryableError(error) || attempt === finalConfig.maxAttempts) {
        throw lastError;
      }

      const delay = Math.min(
        finalConfig.baseDelay *
          Math.pow(finalConfig.backoffMultiplier, attempt - 1),
        finalConfig.maxDelay,
      );

      logger?.warn(
        `Attempt ${attempt} failed, retrying in ${delay}ms. Error: ${lastError.message}`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
