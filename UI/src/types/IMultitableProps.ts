import { Column } from "../components/ListComponent/ListComponent";
import { ICalendar } from "./ICalendar.type";
import { Candidate } from "./ICandidate";

export interface InterviewsProps {
  pageName: string;
  isPending: boolean;
  data: Candidate[] | undefined;
  columns: Column<Record<string, string | number | File | null | undefined>>[];
}

export interface CalendarProps {
  pageName: string;
  isPending: boolean;
  data: ICalendar[] | undefined;
  columns: Column<Record<string, string | number | File | null | undefined>>[];
}
