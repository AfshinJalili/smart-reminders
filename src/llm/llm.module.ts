import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { LlmService } from './llm.service';
import { OpenAiService } from './providers/openai/open-ai.service';
import { LLM_PROVIDER_TOKEN } from './constants';

@Module({
  imports: [ConfigModule],
  providers: [
    LlmService,
    OpenAiService,
    {
      provide: LLM_PROVIDER_TOKEN,
      useExisting: OpenAiService,
    },
  ],
  exports: [LlmService],
})
export class LlmModule {}
