/**
 * This entity is only for future proofing in case we want to save reminders to a database.
 * It is not used in the current implementation.
 */
export class Reminder {
  id: string;
  title: string;
  dateTime: string;
  createdAt: Date;
  updatedAt: Date;
}
