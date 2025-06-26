import { ListTable } from "../../../components/ListComponent/ListComponent";
import { InterviewsProps } from "../../../types/IMultitableProps";

export const Interviews = ({
  isPending,
  data,
  columns,
  pageName,
}: InterviewsProps) => {
  return (
    <>
      <div className="bg-base-100 min-h-[78vh] p-3 rounded-lg shadow-md">
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
