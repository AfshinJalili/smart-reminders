import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { LlmService } from './llm/llm.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly llmService: LlmService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('reminder')
  async createReminder(@Body() body: { prompt: string }) {
    try {
      const reminder = await this.llmService.generateReminder({
        userPrompt: body.prompt,
        userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      return {
        success: true,
        data: reminder,
      };
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  @Get('test-reminders')
  async testReminders() {
    const testPrompts = [
      'یادآوری کن که فردا ساعت ۳ بعدازظهر خرید کنم',
      'برای وقت دندانپزشکی من در روز جمعه ساعت ۲:۳۰ بعدازظهر یادآور تنظیم کن',
      'باید یکشنبه ساعت ۱۰ صبح به مادرم زنگ بزنم',
      'یادآوری کن که تا دوشنبه آینده ساعت ۵ عصر گزارش را ارسال کنم',
      'برای تمرین صبحگاهی من فردا ساعت ۶ صبح آلارم تنظیم کن',
    ];

    const results: Array<{
      prompt: string;
      success: boolean;
      reminder?: { description: string; dateTime: Date };
      error?: string;
    }> = [];

    for (const prompt of testPrompts) {
      try {
        const reminder = await this.llmService.generateReminder({
          userPrompt: prompt,
          userTimezone: 'Asia/Tehran',
        });
        results.push({
          prompt,
          success: true,
          reminder,
        });
      } catch (error) {
        results.push({
          prompt,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      message: 'Test reminders generated',
      results,
    };
  }
}
