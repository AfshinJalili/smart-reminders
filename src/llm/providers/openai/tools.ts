import { FunctionTool } from 'openai/resources/responses/responses';

export const reminderGenerationFunction: FunctionTool = {
  strict: true,
  type: 'function',
  name: 'extract_task_details',
  description: `Extracts a task and UTC datetime from natural language prompts in English or Persian.`,
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The main task (no "remind me" or "set an alarm" etc).',
        nullable: true,
      },
      dateTime: {
        type: 'string',
        description: 'Datetime in ISO 8601 UTC format. Based on user timezone.',
        nullable: true,
      },
      error: {
        type: 'string',
        description:
          'A brief error message when the input is vague, incomplete, or unprocessable.',
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },
};
