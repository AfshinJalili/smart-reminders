import { Injectable } from '@nestjs/common';
import { LlmService } from 'src/llm/llm.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly llmService: LlmService) {}

  async create(createReminderDto: CreateReminderDto) {
    const reminder = await this.llmService.generateReminder(createReminderDto);
    console.log(reminder);
    return reminder;
  }
}
