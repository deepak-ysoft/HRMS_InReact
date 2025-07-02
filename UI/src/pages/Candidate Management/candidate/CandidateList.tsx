import React, { useRef, useState } from "react";
import {
  Column,
  ListTable,
} from "../../../components/ListComponent/ListComponent";
import { Candidate } from "../../../types/ICandidate";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCandidateApi } from "../../../services/Candidate/GetCandidate.query";
import { useNavigate } from "react-router-dom";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import SearchBar from "../../../components/layout/SearchBar";
// import { FilterBar } from "../../components/ListComponent/FilterBar";
import Pagination from "../../../components/ListComponent/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons"; // Outline eye
import { FaDownload, FaUpload, FaUserEdit } from "react-icons/fa";
import { deleteCandidate } from "../../../services/Candidate/DeleteCandidate.query";
import { ConfirmDelete } from "../../../components/DeletionConfirm/ConfirmDelete";
import { toast } from "react-toastify";
import { DownloadExcel } from "../../../services/Candidate/DownloadExcel.query";
import { AddCandidateWithExcel } from "../../../services/Candidate/AddCandidateWithExcel.query";

const CandidateListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);

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

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const data = await deleteCandidate(deleteId);
    refetch();
    setShowDelete(false);
    setDeleteId(null);
    // Show custom toast from toast.ts
    if (data.isSuccess) {
      toast.success(data.message);
    } else {
      toast.warning(data.message);
    }
  };

  const handleDeleteCancel = () => {
    setShowDelete(false);
    setDeleteId(null);
  };

  const { isPending: excelIsPending, refetch: excelRefetch } = useQuery({
    queryKey: ["getCandidateDownload"],
    queryFn: () => DownloadExcel(),
  });

  const handleExcelDownload = async () => {
    const response = await excelRefetch();
    const data = response?.data?.data; // Corrected path

    if (data?.fileContents) {
      const byteCharacters = atob(data.fileContents);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type:
          data.contentType ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileDownloadName || "candidates.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } else {
      toast.error("fileContents is undefined");
    }
  };

  const { mutate: UploadExcel } = useMutation({
    mutationFn: (data: FormData) => AddCandidateWithExcel(data),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
        refetch();
      } else {
        toast.warning(data.message);
      }
    },
  });

  const handleFileUpload = (data: File) => {
    const formData = new FormData();
    formData.append("file", data);
    UploadExcel(formData);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
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
        <div className="flex gap-3">
          {/* Empty Eye (Outline View) */}
          <FontAwesomeIcon
            icon={faEye}
            onClick={() =>
              navigate(`/candidates/candidate-Details`, { state: row })
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
      ),
    },
  ];

  // const filterOptions = {
  //   roles: ["Developer", "Designer", "HR"],
  // };

  return (
    <>
      <BreadCrumbsComponent />
      <div className="bg-base-100 min-h-[78vh] p-3 rounded-lg shadow-md flex flex-col justify-between">
        <div className="mx-5 mt-5">
          <div className="grid grid-cols-10 mb-5 items-center">
            <div className="col-span-2">
              <h1 className="text-2xl font-bold">Candidates</h1>
            </div>
            <div className="flex justify-end col-span-6 pr-3">
              <SearchBar
                iconClass="right-0"
                className="transition-all p-2 pl-3 mr-12 border border-[rgb(202,194,255)] rounded-xl duration-300 ease-in-out focus:outline-none focus:ring-0 focus:border-[rgb(159,145,251)]"
                onChange={(e) => setSearchValue(e.target.value)}
                showInput={showSearch}
                setShowInput={setShowSearch}
              />
            </div>
            <div className="col-span-2 grid grid-cols-5 gap-4">
              <div className="col-span-3 ">
                <Button
                  type="button"
                  text="Add Candidate"
                  onClick={() => navigate("/candidates/add-candidate")}
                  className="bg-[rgb(66,42,213)] text-white  w-full "
                />
              </div>
              <div>
                <Button
                  type="button"
                  text={<FaDownload className="my-1" />}
                  onClick={() => handleExcelDownload()}
                  disabled={excelIsPending}
                  title="Download Excel"
                  className="bg-[rgb(66,42,213)] text-white"
                />
              </div>
              <div>
                {/* Hidden file input */}
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {/* Custom upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[rgb(66,42,213)] text-white p-2 px-4 rounded-lg"
                  title="Upload Excel"
                >
                  <FaUpload className="my-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow">
          {isPending ? (
            <div>Loading...</div>
          ) : (
            <>
              <ListTable<Candidate> columns={columns} data={data?.data || []} />
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
            isShowSize={true}
          />
        </div>
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
    </>
  );
};

export default CandidateListPage;
