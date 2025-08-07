import { CreateReminderDto } from 'src/reminders/dto/create-reminder.dto';

export interface ReminderDetails {
  title: string;
  dateTime: string;
}

export interface LlmProvider {
  generateReminder(input: CreateReminderDto): Promise<ReminderDetails>;
}
