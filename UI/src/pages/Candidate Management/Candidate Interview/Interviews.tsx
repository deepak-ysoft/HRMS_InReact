import {
  Column,
  ListTable,
} from "../../../components/ListComponent/ListComponent";
import { Candidate } from "../../../types/ICandidate";
export interface InterviewsProps {
  pageName: string;
  isPending: boolean;
  data: Candidate[] | undefined;
  columns: Column<Record<string, string | number | File | null | undefined>>[];
}
export const Interviews = ({
  isPending,
  data,
  columns,
  pageName,
}: InterviewsProps) => {
  return (
    <>
      <div className="bg-base-100 min-h-[780px] p-3 rounded-lg shadow-md">
        <div className="mx-5 mt-3 mb-5">
          <div className=" mb-3 items-center">
            <h1 className="text-2xl font-bold">{pageName}</h1>
          </div>
        </div>
        <div className="max-h-[550px] overflow-y-auto">
          {" "}
          {isPending ? (
            <div>Loading...</div>
          ) : (
            <>
              <ListTable columns={columns} data={data || []} />
              <span className="flex justify-end items-center gap-2 mt-3 mr-8"></span>
            </>
          )}
        </div>
      </div>
    </>
  );
};
