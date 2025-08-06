import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { OpenAiService } from './open-ai.service';

@Module({
  providers: [LlmService, OpenAiService],
  exports: [LlmService],
})
export class LlmModule {}
