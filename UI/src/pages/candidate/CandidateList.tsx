import React, { useState } from "react";
import {
  Column,
  ListTable,
} from "../../components/ListComponent/ListComponent";
import { Candidate } from "../../types/ICandidate";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import { getCandidateApi } from "../../services/Candidate/GetCandidate.query";

const CandidateListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchField, setSearchField] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const { data, isPending } = useQuery({
    queryKey: [
      "getCandidate",
      page,
      pageSize,
      sortColumn,
      sortDirection,
      searchField,
      searchValue,
    ],
    queryFn: () =>
      getCandidateApi({
        page,
        pageSize,
        sortColumn,
        sortDirection,
        searchField,
        searchValue,
      }),
  });

  // Define which columns to show in the table (do not include `cv`)
  const columns: Column<Candidate>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email_ID" },
    { header: "Contact No", accessor: "contact_No" },
    { header: "Role", accessor: "roles" },
    { header: "CTC", accessor: "ctc" },
    { header: "ETC", accessor: "etc" },
    { header: "Status", accessor: "schedule_Interview_status" },
    {
      header: "CV",
      accessor: "cv",
      render: (row) =>
        row.cv ? (
          <a href={URL.createObjectURL(row.cv)} download={row.cv.name}>
            Download
          </a>
        ) : (
          "No CV"
        ),
    },
  ];

  const filters: Partial<Record<keyof Candidate, (string | number)[]>> = {
    roles: ["Developer", "Designer", "HR"],
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <Button
          type="button"
          text="Add Candidate"
          className="bg-[rgb(66,42,213)] text-white py-2 px-4 rounded"
        />
      </div>

      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-base-100 p-4 rounded-lg shadow-md mt-4">
          <ListTable<Candidate>
            title="Candidate List"
            columns={columns} // Excluding 'cv' field from columns
            data={data?.data} // Cast the data to CandidateTableData
            showFilter={true}
            filters={filters}
            showSearch={true}
            showPagination={true}
            pageSize={10}
          />
        </div>
      )}
    </>
  );
};

export default CandidateListPage;
