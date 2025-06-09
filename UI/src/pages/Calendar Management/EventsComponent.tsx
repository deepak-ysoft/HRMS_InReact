import { ListTable } from "../../components/ListComponent/ListComponent";
import { CalendarProps } from "../../types/IMultitableProps";

export const EventsComponent = ({
  isPending,
  data,
  columns,
  pageName,
}: CalendarProps) => {
  console.log(data);
  return (
    <>
      <div className="bg-base-100 min-h-[780px] p-3 rounded-lg shadow-md">
        <div className="mx-5 mt-3 mb-5">
          <div className=" mb-3 items-center">
            <h1 className="text-2xl font-bold">{pageName}</h1>
          </div>
        </div>
        <div className="max-h-[690px] overflow-y-auto">
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
