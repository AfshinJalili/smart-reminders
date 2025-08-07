import { Injectable, Logger, Inject } from '@nestjs/common';
import { LlmProvider, ReminderDetails } from './interfaces';
import { CreateReminderDto } from 'src/reminders/dto/create-reminder.dto';
import { LLM_PROVIDER_TOKEN } from './constants';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(
    @Inject(LLM_PROVIDER_TOKEN)
    private readonly llmProvider: LlmProvider,
  ) {}

  /**
   * Generate a reminder using the LLM provider
   * @param input The input data containing the user prompt and timezone
   * @returns Promise that resolves to the generated reminder details
   */
  async generateReminder(input: CreateReminderDto): Promise<ReminderDetails> {
    return this.llmProvider.generateReminder(input);
  }
}
