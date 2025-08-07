import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  OpenAiServiceError,
  ReminderGenerationError,
  VagueInputError,
  MissingRequiredFieldsError,
  NoFunctionCallError,
  InvalidResponseError,
} from '../../llm/providers/openai/errors';

@Catch()
export class LlmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LlmExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof VagueInputError) {
      this.logger.warn(`Vague input error: ${exception.errorMessage}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid input provided',
        error: 'Bad Request',
        details: exception.errorMessage,
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof MissingRequiredFieldsError) {
      this.logger.warn(`Missing required fields: ${exception.errorMessage}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Missing required information',
        error: 'Bad Request',
        details: exception.errorMessage,
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof NoFunctionCallError) {
      this.logger.error('No function call returned from OpenAI');
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to process your request',
        error: 'Internal Server Error',
        details: 'The AI service could not process your input properly',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof InvalidResponseError) {
      this.logger.error(
        'Invalid response from OpenAI',
        exception.originalError,
      );
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to process your request',
        error: 'Internal Server Error',
        details: 'The AI service returned an invalid response',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof ReminderGenerationError) {
      this.logger.error('Reminder generation failed', exception.originalError);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create reminder',
        error: 'Internal Server Error',
        details: 'Unable to process your reminder request at this time',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof OpenAiServiceError) {
      this.logger.error('OpenAI service error', exception.originalError);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Service temporarily unavailable',
        error: 'Internal Server Error',
        details: 'The AI service is currently experiencing issues',
        timestamp: new Date().toISOString(),
      });
    }

    // Handle other errors (fallback)
    this.logger.error('Unhandled exception', exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
      details: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  }
}
