import React, { useState } from "react";
import {
  Column,
  ListTable,
} from "../../../../components/ListComponent/ListComponent";
import { DownloadPayslipQuery } from "../../../../services/Employee Management/Payroll/DownloadPayslipQuery";
import { HiOutlineDownload } from "react-icons/hi";
import { SafeDetailsRecord } from "../../../../types/ISafeDetailsRecord.type";
import { useQuery } from "@tanstack/react-query";
import { GetPayrollSlipQuery } from "../../../../services/Employee Management/Payroll/GetSlip.query";
import SearchBar from "../../../../components/layout/SearchBar";
import Pagination from "../../../../components/ListComponent/Pagination";

interface Props {
  empId: number;
}

const getMonthName = (monthNumber: number): string => {
  return new Date(0, monthNumber - 1).toLocaleString("default", {
    month: "long",
  });
};

const PayrollSection: React.FC<Props> = ({ empId }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["GetPayrollSlip", empId, page, pageSize, searchValue],
    queryFn: () => GetPayrollSlipQuery(empId, page, pageSize, searchValue),
  });

  const columns: Column<SafeDetailsRecord>[] = [
    {
      header: "Month",
      accessor: "month",
      render: (row) => getMonthName(row.month as number),
    },
    { header: "Year", accessor: "year" },
    {
      header: "Basic Salary",
      accessor: "basicSalary",
      render: (row) => `₹${row.basicSalary}`,
    },
    {
      header: "HRA",
      accessor: "hra",
      render: (row) => `₹${row.hra}`,
    },
    {
      header: "Bonus",
      accessor: "bonus",
      render: (row) => `₹${row.bonus}`,
    },
    {
      header: "Deductions",
      accessor: "deductions",
      render: (row) => `₹${row.deductions}`,
    },
    {
      header: "Net Pay",
      accessor: "netPay",
      render: (row) => `₹${row.netPay}`,
    },
    {
      header: "Payslip",
      accessor: "id", // used just as placeholder
      render: (row) => {
        const empId = row.employeeId;
        const year = row.year;
        const month = row.month;

        const isValid =
          typeof empId === "number" &&
          typeof year === "number" &&
          typeof month === "number";

        return isValid ? (
          <button
            onClick={() =>
              DownloadPayslipQuery(empId, year as number, month as number)
            }
            className="text-blue-600 hover:underline"
          >
            <HiOutlineDownload />
          </button>
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      },
    },
  ];

  return (
    <div className="bg-base-100 min-h-[78vh] p-3 rounded-lg shadow-md flex flex-col justify-between">
      {/* Top: Header and Content */}
      <div className="mx-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Payroll</h1>
          <SearchBar
            iconClass="right-0"
            className="transition-all p-2 pl-3 mr-12 border border-[rgb(202,194,255)] rounded-xl duration-300 ease-in-out focus:outline-none focus:ring-0 focus:border-[rgb(159,145,251)]"
            onChange={(e) => setSearchValue(e.target.value)}
            showInput={showSearch}
            setShowInput={setShowSearch}
          />
        </div>
      </div>

      {/* Middle: Table */}
      <div className="flex-grow">
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <ListTable columns={columns} data={data?.data?.salary || []} />
        )}
      </div>

      {/* Bottom: Pagination */}
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

export default PayrollSection;
