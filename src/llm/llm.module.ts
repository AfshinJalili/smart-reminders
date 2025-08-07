import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { OpenAiService } from './providers/openai/open-ai.service';
import { LLM_PROVIDER_TOKEN } from './constants';

@Module({
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
