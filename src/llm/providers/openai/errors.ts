export class OpenAiServiceError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'OpenAiServiceError';
  }
}

export class ReminderGenerationError extends OpenAiServiceError {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message, originalError);
    this.name = 'ReminderGenerationError';
  }
}

export class NoFunctionCallError extends ReminderGenerationError {
  constructor() {
    super('No function call returned from OpenAI');
    this.name = 'NoFunctionCallError';
  }
}

export class InvalidResponseError extends ReminderGenerationError {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message, originalError);
    this.name = 'InvalidResponseError';
  }
}
