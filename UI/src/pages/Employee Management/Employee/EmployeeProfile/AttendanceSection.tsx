import React, { useState } from "react";
import {
  Column,
  ListTable,
} from "../../../../components/ListComponent/ListComponent";
import dayjs from "dayjs";
import { SafeDetailsRecord } from "../../../../types/ISafeDetailsRecord.type";
import Pagination from "../../../../components/ListComponent/Pagination";
import { useQuery } from "@tanstack/react-query";
import { GetAttendanceQuery } from "../../../../services/Employee Management/Attendance/GetAttendance.query";
import SearchBar from "../../../../components/layout/SearchBar";

// This is required to satisfy ListTable's constraint
interface Props {
  empId: number;
}

const AttendanceSection: React.FC<Props> = ({ empId }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["getEmployees", empId, page, pageSize, searchValue],
    queryFn: () => GetAttendanceQuery(empId, page, pageSize, searchValue),
  });

  const columns: Column<SafeDetailsRecord>[] = [
    {
      header: "Date",
      accessor: "date",
      render: (row) => dayjs(String(row.date)).format("YYYY-MM-DD"),
    },
    {
      header: "Check In",
      accessor: "checkIn",
      render: (row) => dayjs(String(row.checkIn)).format("YYYY-MM-DD hh:mm A"),
    },
    {
      header: "Check Out",
      accessor: "checkOut",
      render: (row) => dayjs(String(row.checkOut)).format("YYYY-MM-DD hh:mm A"),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "Present"
              ? "bg-green-100 text-green-700"
              : row.status === "Late"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status?.toString() || "Unknown"}
        </span>
      ),
    },
    { header: "Remarks", accessor: "remarks" },
  ];

  return (
    <div className="bg-base-100 min-h-[78vh] p-3 rounded-lg shadow-md  flex flex-col justify-between">
      <div className="mx-5 mt-3 mb-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Attendance</h1>
          <SearchBar
            iconClass="right-0"
            className="transition-all p-2 pl-3 mr-12 border border-[rgb(202,194,255)] rounded-xl duration-300 ease-in-out focus:outline-none focus:ring-0 focus:border-[rgb(159,145,251)]"
            onChange={(e) => setSearchValue(e.target.value)}
            showInput={showSearch}
            setShowInput={setShowSearch}
          />
        </div>
      </div>
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
  );
};

export default AttendanceSection;
