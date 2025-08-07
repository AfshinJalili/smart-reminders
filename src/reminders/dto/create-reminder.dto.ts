import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReminderDto {
  @IsString({ message: 'User prompt must be a string' })
  @IsNotEmpty({ message: 'User prompt is required' })
  @MinLength(3, { message: 'User prompt must be at least 3 characters long' })
  @MaxLength(500, { message: 'User prompt cannot exceed 500 characters' })
  @Transform(({ value }) => value?.trim())
  userPrompt: string;

  @IsString({ message: 'User timezone must be a string' })
  @IsNotEmpty({ message: 'User timezone is required' })
  @Transform(({ value }) => value?.trim())
  userTimezone: string;
}
