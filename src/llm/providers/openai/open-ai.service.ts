import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { LlmProvider, ReminderDetails } from '../../interfaces';
import { reminderGenerationFunction } from './tools';
import { CreateReminderDto } from 'src/reminders/dto/create-reminder.dto';
import { ConfigService } from 'src/config/config.service';
import {
  NoFunctionCallError,
  InvalidResponseError,
  VagueInputError,
  MissingRequiredFieldsError,
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
          const parsedResponse = JSON.parse(
            response.output[0].arguments,
          ) as ReminderDetails & { error?: string };

          if (parsedResponse.error) {
            throw new VagueInputError(parsedResponse.error);
          }

          if (!parsedResponse.title || !parsedResponse.dateTime) {
            throw new MissingRequiredFieldsError(
              'Missing required fields: title or dateTime',
            );
          }

          return parsedResponse;
        } catch (parseError) {
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

    return await withRetry(apiCallOperation, DEFAULT_RETRY_CONFIG, this.logger);
  }
}
