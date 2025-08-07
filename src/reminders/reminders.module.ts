import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { LlmModule } from 'src/llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
