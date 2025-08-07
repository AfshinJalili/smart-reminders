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

export class VagueInputError extends ReminderGenerationError {
  constructor(public readonly errorMessage: string) {
    super(`Vague or incomplete input: ${errorMessage}`);
    this.name = 'VagueInputError';
  }
}

export class MissingRequiredFieldsError extends ReminderGenerationError {
  constructor(public readonly errorMessage: string) {
    super(`Missing required fields: ${errorMessage}`);
    this.name = 'MissingRequiredFieldsError';
  }
}
