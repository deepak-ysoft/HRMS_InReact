import React, { useState, useRef } from "react";
import {
  Column,
  ListTable,
} from "../../components/ListComponent/ListComponent";
import { Candidate } from "../../types/ICandidate";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import { getCandidateApi } from "../../services/Candidate/GetCandidate.query";
import { useNavigate } from "react-router-dom";
import { BreadCrumbsComponent } from "../../components/Breadcrumbs/BreadCrumbsComponents";
import SearchBar from "../../components/layout/SearchBar";
// import { FilterBar } from "../../components/ListComponent/FilterBar";
import Pagination from "../../components/ListComponent/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons"; // Outline eye
import { FaUserEdit } from "react-icons/fa";
import { deleteCandidate } from "../../services/Candidate/DeleteCandidate.query";
import { ConfirmDelete } from "../../components/DeletionConfirm/ConfirmDelete";

const CandidateListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  
  const { data, isPending, refetch } = useQuery({
    queryKey: ["getCandidate", page, pageSize, searchValue],
    queryFn: () =>
      getCandidateApi({
        page,
        pageSize,
        searchValue,
      }),
  });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteCandidate(deleteId);
      refetch();
      setToastMsg("Candidate deleted successfully!");
      setShowDelete(false);
      setDeleteId(null);
      // Optionally, you can refetch the candidates after deletion
      // queryClient.invalidateQueries(["getCandidate"]);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setToastMsg(null), 2500);
    } catch {
      setToastMsg("Error deleting candidate!");
      setShowDelete(false);
      setDeleteId(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setToastMsg(null), 2500);
    }
  };

  const handleDeleteCancel = () => {
    setShowDelete(false);
    setDeleteId(null);
  };

  const columns: Column<Candidate>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email_ID" },
    { header: "Contact No", accessor: "contact_No" },
    { header: "Role", accessor: "roles" },
    { header: "CTC", accessor: "ctc" },
    { header: "ETC", accessor: "etc" },
    { header: "Status", accessor: "schedule_Interview_status" },
    {
      header: "Action",
      accessor: "Action",
      render: (row) => (
        console.log("row", row),
        (
          <div className="flex gap-3">
            {/* Empty Eye (Outline View) */}
            <FontAwesomeIcon
              icon={faEye}
              onClick={() =>
                navigate(`/candidates/candidateDetails`, { state: row })
              }
              className="text-[rgb(66,42,213)] text-[15px] hover:text-[rgb(43,36,85)] cursor-pointer transition-all duration-200  hover:scale-110"
              title="View"
            />
            {/* Person Edit (Stacked Icon) */}
            <FaUserEdit
              onClick={() =>
                navigate(`/candidates/add-candidate`, { state: row })
              }
              className="text-[rgb(159,145,251)]  text-[18px] hover:text-[rgb(105,90,209)] cursor-pointer transition-all duration-200 hover:scale-110"
              title="Edit"
            />
            {/* Empty Trash */}
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-[#FF4C4C] hover:text-[#cc0000]  text-[15px] cursor-pointer transition-all duration-200 hover:scale-110"
              title="Delete"
              onClick={() => handleDeleteClick(row.id)}
            />
          </div>
        )
      ),
    },
  ];

  // const filterOptions = {
  //   roles: ["Developer", "Designer", "HR"],
  // };

  return (
    <>
      <BreadCrumbsComponent />
      <div className="bg-base-100 min-h-[650px] p-3 rounded-lg shadow-md">
        <div className="mx-5 mt-3 mb-5">
          <div className="grid grid-cols-9 mb-3 items-center">
            <div className="col-span-2">
              <h1 className="text-2xl font-bold">Candidates</h1>
            </div>
            <div className="flex justify-end col-span-6 pr-3">
              <SearchBar
                iconClass="right-0"
                className="transition-all p-2 pl-3 mr-12 border border-[rgb(202,194,255)] rounded-xl duration-300 ease-in-out focus:outline-none focus:ring-0 focus:border-[rgb(159,145,251)]"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            {/* <div className="flex justify-center w-full">
                 <FilterBar
                  filters={filterOptions}
                  selectedFilters={filters}
                  onFilterChange={setFilters}
                  className="flex gap-2"
                /> 
              </div> */}
            <div className=" w-full">
              <Button
                type="button"
                text="Add Candidate"
                onClick={() => navigate("/candidates/add-candidate")}
                className="bg-[rgb(66,42,213)] text-white rounded  w-full"
              />
            </div>
          </div>
        </div>
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <>
            <ListTable<Candidate>
              columns={columns}
              data={data?.data || []}
            />
            <span className="flex justify-end items-center gap-2 mt-3 mr-8">
              <Pagination
                page={page}
                pageSize={pageSize}
                totalCount={data?.totalCount || 0}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </span>
          </>
        )}
      </div>
      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-slide-in-fade-out">
          <ConfirmDelete
            isOpen={showDelete}
            onDelete={handleDeleteConfirm}
            onClose={handleDeleteCancel}
          />
        </div>
      )}
      {toastMsg && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg transition-transform duration-500 ease-in-out
            ${
              toastMsg.includes("success") ? "bg-green-600" : "bg-red-600"
            } text-white
            animate-slide-in-fade-out`}
          style={{
            transform: toastMsg ? "translateY(0)" : "translateY(-40px)",
            opacity: toastMsg ? 1 : 0,
          }}
        >
          {toastMsg}
        </div>
      )}
    </>
  );
};

export default CandidateListPage;
