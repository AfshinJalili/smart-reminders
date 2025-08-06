import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { Tool } from 'openai/resources/responses/responses';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly openai: OpenAI;
  /**
   * Extract task details from natural language using function calling
   */
  private functions: Tool[] = [
    {
      strict: true,
      type: 'function',
      name: 'extract_task_details',
      description: `Extracts task details from a natural language message. dateTime must be in ISO 8601 format.`,
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the task',
          },
          dateTime: {
            type: 'string',
            description:
              'The date and time of the task in ISO 8601 format. UTC timezone',
          },
        },
        required: ['title', 'dateTime'],
        additionalProperties: false,
      },
    },
  ];

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

  async extractTaskDetails(input: {
    userPrompt: string;
    userTimezone: string;
  }): Promise<{
    title: string;
    dateTime: string;
  }> {
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
        tools: this.functions,
        tool_choice: {
          type: 'function',
          name: 'extract-task-details',
        },
      });

      if (response.output[0].type === 'function_call') {
        console.log(new Date().toISOString());
        console.log(response.output[0]);
        return JSON.parse(response.output[0].arguments) as {
          title: string;
          dateTime: string;
        };
      }
      throw new Error('No function call returned from OpenAI');
    } catch (error) {
      this.logger.error('Error extracting task details:', error);
      throw error;
    }
  }
}
