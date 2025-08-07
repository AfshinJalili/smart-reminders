import { Module } from '@nestjs/common';
import { LlmModule } from './llm/llm.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [LlmModule, RemindersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
