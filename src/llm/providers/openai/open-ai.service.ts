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

const SYSTEM_PROMPT_TEMPLATE = `You are a task extractor. Always call the extract_task_details function to extract task details from the user message.
You must use the current date and time to extract the date and time of the task.
don't include 'set an alarm' or 'remind me' etc, in the title.
currentDate in UTC is {currentDate},
user timezone is {userTimezone}`;

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
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace(
      '{currentDate}',
      currentDate,
    ).replace('{userTimezone}', input.userTimezone);

    const response = await this.openai.responses
      .create({
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
      })
      .catch((error) => {
        this.logger.error('Error calling OpenAI API:', error);
        throw new ReminderGenerationError(
          'Failed to generate reminder from OpenAI',
          error,
        );
      });

    if (!response.output?.[0]) {
      throw new InvalidResponseError('Empty response from OpenAI');
    }

    if (response.output[0].type === 'function_call') {
      try {
        return JSON.parse(response.output[0].arguments) as ReminderDetails;
      } catch (parseError) {
        this.logger.error('Error parsing function call arguments:', parseError);
        throw new InvalidResponseError(
          'Invalid function call arguments format',
          parseError instanceof Error
            ? parseError
            : new Error(String(parseError)),
        );
      }
    }

    throw new NoFunctionCallError();
  }
}
