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

  async generateReminder(input: CreateReminderDto): Promise<ReminderDetails> {
    return this.llmProvider.generateReminder(input);
  }
}
