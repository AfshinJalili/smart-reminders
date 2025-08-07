import {
  IsString,
  IsArray,
  IsOptional,
  IsDateString,
  IsEnum,
  IsObject,
  Max,
  Min,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RetryConfigDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  maxRetries?: number;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(300000)
  retryDelay?: number;
}

export class ScheduleNotificationDto {
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @IsString()
  subject: string;

  @IsString()
  content: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: 'low' | 'normal' | 'high' | 'urgent' = 'normal';

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @ValidateNested()
  @Type(() => RetryConfigDto)
  retryConfig?: RetryConfigDto;
}
