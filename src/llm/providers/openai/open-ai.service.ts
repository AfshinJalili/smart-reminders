import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { LlmProvider, ReminderDetails } from '../../interfaces';
import { reminderGenerationFunction } from './tools';
import { CreateReminderDto } from 'src/reminders/dto/create-reminder.dto';

@Injectable()
export class OpenAiService implements LlmProvider {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly openai: OpenAI;

  constructor() {
    const apiKey =
      process.env.OPENAI_API_KEY ||
      'aa-fr5t1creBl11thRy5b1SkBy4aD3TlxQa54cTxKlmviSCy8Cs';

    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY environment variable is not set');
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey,
      baseURL: 'https://api.avalai.ir/v1',
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
    try {
      const response = await this.openai.responses.create({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        input: [
          {
            role: 'system',
            content: `You are a task extractor. Always call the extract_task_details function to extract task details from the user message.
              You must use the current date and time to extract the date and time of the task.
              don't include 'set an alarm' or 'remind me' etc, in the title.
              currentDate in UTC is ${new Date().toISOString()},
              user timezone is ${input.userTimezone}`,
          },
          { role: 'user', content: input.userPrompt },
        ],
        tools: [reminderGenerationFunction],
        tool_choice: {
          type: 'function',
          name: reminderGenerationFunction.name,
        },
      });

      if (response.output[0].type === 'function_call') {
        return JSON.parse(response.output[0].arguments) as ReminderDetails;
      }
      throw new Error('No function call returned from OpenAI');
    } catch (error) {
      this.logger.error('Error extracting task details:', error);
      throw error;
    }
  }
}
