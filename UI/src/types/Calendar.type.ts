import { CalendarEventType } from "./Enum/CalendarLeave";

export type CalendarEvent = {
  calId: string;
  title: CalendarEventType;
  description: string;
  start: string;
  end: string;
};
