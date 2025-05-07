export interface Candidate {
  name: string;
  contact_No: string;
  linkedin_Profile?: string;
  email_ID: string;
  roles: string;
  experience: string;
  skills: string;
  ctc: number | string;
  etc: number | string;
  notice_Period: string;
  current_Location: string;
  prefer_Location: string;
  reason_For_Job_Change: string;
  schedule_Interview?: string;
  schedule_Interview_status?: string;
  comments: string;
  cv?: File | null;
}
