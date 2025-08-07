import { FunctionTool } from 'openai/resources/responses/responses';

export const reminderGenerationFunction: FunctionTool = {
  strict: true,
  type: 'function',
  name: 'extract_task_details',
  description: `Extracts task details from a natural language message. dateTime must be in ISO 8601 format.`,
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the task',
      },
      dateTime: {
        type: 'string',
        description:
          'The date and time of the task in ISO 8601 format. UTC timezone',
      },
    },
    required: ['title', 'dateTime'],
    additionalProperties: false,
  },
};
