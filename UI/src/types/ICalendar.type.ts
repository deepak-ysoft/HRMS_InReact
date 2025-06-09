export interface ICalendar {
  [key: string]: string | number | File | null | undefined;
  calId?: number;
  title: string;
  description: string;
  start: string;
  end: string;
}
