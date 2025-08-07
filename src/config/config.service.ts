import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  // OpenAI Configuration
  get openaiApiKey(): string {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    return apiKey;
  }

  get openaiBaseUrl(): string {
    return this.configService.get<string>(
      'OPENAI_BASE_URL',
      'https://api.openai.com/v1',
    );
  }

  get openaiModel(): string {
    return this.configService.get<string>('OPENAI_MODEL', 'gpt-4o-mini');
  }

  get openaiTemperature(): number {
    return this.configService.get<number>('OPENAI_TEMPERATURE', 0.5);
  }
}
