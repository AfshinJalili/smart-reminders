import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { LlmModule } from './llm/llm.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [ConfigModule, LlmModule, RemindersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
