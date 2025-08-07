import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { LlmProvider, ReminderDetails } from '../../interfaces';
import { reminderGenerationFunction } from './tools';
import { CreateReminderDto } from 'src/reminders/dto/create-reminder.dto';
import { ConfigService } from 'src/config/config.service';
import {
  NoFunctionCallError,
  InvalidResponseError,
  ReminderGenerationError,
} from './errors';
import { withRetry, DEFAULT_RETRY_CONFIG } from '../../retry.util';
import { constructSystemPrompt } from './prompts';

const TOOL_CHOICE_CONFIG = {
  type: 'function' as const,
  name: reminderGenerationFunction.name,
};

@Injectable()
export class OpenAiService implements LlmProvider {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.openaiApiKey;
    const baseURL = this.configService.openaiBaseUrl;

    this.openai = new OpenAI({
      apiKey,
      baseURL,
      dangerouslyAllowBrowser: false,
    });

    this.logger.log('OpenAI client initialized successfully');
  }

  /**
   * Get the configured OpenAI client instance
   */
  getClient(): OpenAI {
    return this.openai;
  }

  async generateReminder(input: CreateReminderDto): Promise<ReminderDetails> {
    const currentDate = new Date().toISOString();
    const systemPrompt = constructSystemPrompt(currentDate, input.userTimezone);

    const apiCallOperation = async () => {
      const response = await this.openai.responses.create({
        model: this.configService.openaiModel,
        temperature: this.configService.openaiTemperature,
        input: [
          {
            role: 'system',
            content: systemPrompt,
          },
          { role: 'user', content: input.userPrompt },
        ],
        tools: [reminderGenerationFunction],
        tool_choice: TOOL_CHOICE_CONFIG,
      });

      if (!response.output?.[0]) {
        throw new InvalidResponseError('Empty response from OpenAI');
      }

      if (response.output[0].type === 'function_call') {
        try {
          return JSON.parse(response.output[0].arguments) as ReminderDetails;
        } catch (parseError) {
          this.logger.error(
            'Error parsing function call arguments:',
            parseError,
          );
          throw new InvalidResponseError(
            'Invalid function call arguments format',
            parseError instanceof Error
              ? parseError
              : new Error(String(parseError)),
          );
        }
      }

      throw new NoFunctionCallError();
    };
    try {
      return await withRetry(
        apiCallOperation,
        DEFAULT_RETRY_CONFIG,
        this.logger,
      );
    } catch (error) {
      this.logger.error(
        'All retry attempts failed for OpenAI API call:',
        error,
      );
      throw new ReminderGenerationError(
        'Failed to generate reminder from OpenAI after retries',
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
