import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Column,
  ListTable,
} from "../../../../components/ListComponent/ListComponent";
import { DownloadDocumentQuery } from "../../../../services/Employee Management/EmployeeDocument/DownloadDocument.query";
import { HiOutlineDownload } from "react-icons/hi";
import { SafeDetailsRecord } from "../../../../types/ISafeDetailsRecord.type";
import { useQuery } from "@tanstack/react-query";
import { getDocumentsQuery } from "../../../../services/Employee Management/EmployeeDocument/GetDocuments.query";
import Pagination from "../../../../components/ListComponent/Pagination";
import SearchBar from "../../../../components/layout/SearchBar";

interface Props {
  empId: number;
}

const DocumentsSection: React.FC<Props> = ({ empId }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["getDocuments", empId, page, pageSize, searchValue],
    queryFn: () => getDocumentsQuery(empId, page, pageSize, searchValue),
  });

  const columns: Column<SafeDetailsRecord>[] = [
    { header: "Type", accessor: "documentType" },
    { header: "File Name", accessor: "fileName" },
    {
      header: "Uploaded At",
      accessor: "uploadedAt",
      render: (row) =>
        dayjs(String(row.uploadedAt)).format("DD-MM-YYYY hh:mm A"),
    },
    {
      header: "Expiry",
      accessor: "expiryDate",
      render: (row) =>
        dayjs(String(row.expiryDate)).format("DD-MM-YYYY hh:mm A"),
    },
    {
      header: "Download",
      accessor: "id",
      render: (row) => {
        const fileName = row.fileName;
        const documentId = row.id;

        const isValid =
          typeof fileName === "string" &&
          fileName.trim() !== "" &&
          typeof documentId === "number";

        return isValid ? (
          <button
            onClick={() => DownloadDocumentQuery(documentId, fileName)}
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
      <div className="mx-5 mt-3 mb-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Documents</h1>
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
            <ListTable columns={columns} data={data?.data?.documents || []} />
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

export default DocumentsSection;
