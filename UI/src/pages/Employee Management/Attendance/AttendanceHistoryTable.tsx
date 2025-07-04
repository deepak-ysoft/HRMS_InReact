import React, { useState } from "react";
import { GetAttendanceQuery } from "../../../services/Employee Management/Attendance/GetAttendance.query";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import SearchBar from "../../../components/layout/SearchBar";
import { useQuery } from "@tanstack/react-query";
import {
  Column,
  ListTable,
} from "../../../components/ListComponent/ListComponent";
import Pagination from "../../../components/ListComponent/Pagination";
import dayjs from "dayjs";

const AttendanceHistoryTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const empId = 0;
  const { data, isPending } = useQuery({
    queryKey: ["getAttendance", empId, page, pageSize, searchValue],
    queryFn: () => GetAttendanceQuery(empId, page, pageSize, searchValue),
  });
  const columns: Column<
    Record<string, string | number | File | null | undefined>
  >[] = [
    { header: "Employee", accessor: "employee" },
    {
      header: "Date",
      accessor: "date",
      render: (row) => {
        return (
          <>
            <p> {dayjs(row.date as string).format("YYYY-MM-DD")}</p>
          </>
        );
      },
    },
    {
      header: "Check-in",
      accessor: "checkIn",
      render: (row) => {
        return row.checkIn
          ? new Date(row.checkIn.toString()).toLocaleTimeString()
          : "-";
      },
    },
    {
      header: "Check-out",
      accessor: "checkOut",
      render: (row) => {
        return row.checkOut
          ? new Date(row.checkOut.toString()).toLocaleTimeString()
          : "-";
      },
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        return (
          <>
            <span
              className={`px-3 py-1 rounded-2xl text-black text-sm flex justify-center w-2/3 ${
                row.status === "Present"
                  ? "bg-green-50 border border-green-300"
                  : "bg-red-50 border border-red-300"
              }`}
            >
              {row.status?.toString()}
            </span>
          </>
        );
      },
    },
    { header: "Remarks", accessor: "remarks" },
  ];

  return (
    <>
      <BreadCrumbsComponent />
      <div className="bg-base-100 min-h-[78vh] p-3 rounded-lg shadow-md flex flex-col justify-between">
        <div className="flex justify-between col-span-6 pr-3">
          <h1 className="text-2xl font-bold ml-4 pt-4">Attendance History</h1>
          <SearchBar
            iconClass="right-0"
            className="transition-all p-2 pl-3 mr-12 border border-[rgb(202,194,255)] rounded-xl duration-300 ease-in-out focus:outline-none focus:ring-0 focus:border-[rgb(159,145,251)]"
            onChange={(e) => setSearchValue(e.target.value)}
            showInput={showSearch}
            setShowInput={setShowSearch}
          />
        </div>
        {/* Table / loading / fallback */}{" "}
        <div className="flex-grow">
          {isPending ? (
            <div>Loading...</div>
          ) : (
            <>
              <ListTable columns={columns} data={data?.data?.history || []} />
            </>
          )}
        </div>
        <div className="flex justify-end mr-8">
          <Pagination
            page={page}
            pageSize={pageSize}
            totalCount={data?.data?.totalCount || 0}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </>
  );
};

export default AttendanceHistoryTable;
