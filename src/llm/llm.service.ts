import { Injectable, Logger } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private readonly openAiService: OpenAiService) {}

  async generateReminder(input: {
    userPrompt: string;
    userTimezone: string;
  }): Promise<{ description: string; dateTime: Date }> {
    try {
      const taskDetails = await this.openAiService.extractTaskDetails(input);
      console.log(taskDetails);
      return {
        description: taskDetails.title,
        dateTime: new Date(taskDetails.dateTime),
      };
    } catch (error) {
      this.logger.error('Error generating reminder:', error);
      return { description: 'Error creating reminder', dateTime: new Date() };
    }
  }
}
