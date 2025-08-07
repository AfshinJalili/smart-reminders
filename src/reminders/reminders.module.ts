import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { LlmModule } from 'src/llm/llm.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [LlmModule, NotificationsModule],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
