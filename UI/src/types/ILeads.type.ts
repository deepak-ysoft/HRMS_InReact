export interface ILeads {
  [key: string]: string | number | File | null | undefined;
  leadsId: number;
  dateTime?: string;
  linkedInProfile?: string | null;
  post: string;
  email: string;
  number: string;
  remarks?: string | null;
}
export interface ILeadsParams {
  page: number;
  pageSize: number;
  searchValue: string;
}
