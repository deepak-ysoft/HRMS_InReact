import React, { useState } from "react";
import { SafeDetailsRecord } from "../../../../types/ISafeDetailsRecord.type";
import {
  Column,
  ListTable,
} from "../../../../components/ListComponent/ListComponent";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { GetReviewsQuery } from "../../../../services/Employee Management/PerformanceReview/GetReviews.query";
import Pagination from "../../../../components/ListComponent/Pagination";
import SearchBar from "../../../../components/layout/SearchBar";

interface Props {
  empId: number;
}

const PerformanceReviewSection: React.FC<Props> = ({ empId }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: ["getReviews", empId, page, pageSize, searchValue],
    queryFn: () => GetReviewsQuery(empId, page, pageSize, searchValue),
  });

  const columns: Column<SafeDetailsRecord>[] = [
    { header: "Period", accessor: "period" },
    {
      header: "Rating",
      accessor: "rating",
      render: (row) => (
        <div className="flex items-center gap-1 text-yellow-500">
          {Array.from({ length: Number(row.rating) || 0 }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.034 3.183a1 1 0 00.95.69h3.356c.969 0 1.371 1.24.588 1.81l-2.716 1.972a1 1 0 00-.364 1.118l1.034 3.183c.3.921-.755 1.688-1.54 1.118l-2.716-1.972a1 1 0 00-1.176 0l-2.716 1.972c-.785.57-1.84-.197-1.54-1.118l1.034-3.183a1 1 0 00-.364-1.118L2.12 8.61c-.783-.57-.38-1.81.588-1.81h3.356a1 1 0 00.95-.69l1.034-3.183z" />
            </svg>
          ))}
        </div>
      ),
    },
    { header: "Comments", accessor: "comments" },
    {
      header: "Review Date",
      accessor: "reviewDate",
      render: (row) => dayjs(String(row.reviewDate)).format("DD-MM-YYYY"),
    },
  ];

  return (
    <div className="bg-base-100 min-h-[78vh] p-3 rounded-lg shadow-md flex flex-col justify-between">
      <div className="mx-5 mt-3 mb-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Performance Review</h1>
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
            <ListTable columns={columns} data={data?.data?.salary || []} />
          </>
        )}
      </div>

      <div className="flex justify-end mr-8">
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={data?.totalCount || 0}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default PerformanceReviewSection;
