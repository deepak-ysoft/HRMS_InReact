import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaUpload, FaUserEdit } from "react-icons/fa";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { BreadCrumbsComponent } from "../../components/Breadcrumbs/BreadCrumbsComponents";
import SearchBar from "../../components/layout/SearchBar";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import {
  Column,
  ListTable,
} from "../../components/ListComponent/ListComponent";
import Pagination from "../../components/ListComponent/Pagination";
import { ConfirmDelete } from "../../components/DeletionConfirm/ConfirmDelete";
import { ILeads } from "../../types/ILeads.type";
import { GetLeadsQuery } from "../../services/Leads/GetLeads.query";
import { DeleteLeadQuery } from "../../services/Leads/DeleteLead.query";
import { AddLeadsFromExcelQuery } from "../../services/Leads/AddLeadsFromExcel.query";
import dayjs from "dayjs";

export const GetLeads: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["getLeads", page, pageSize, searchValue],
    queryFn: () =>
      GetLeadsQuery({
        page,
        pageSize,
        searchValue,
      }),
  });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const data = await DeleteLeadQuery(deleteId);
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

  const { mutate: UploadExcel } = useMutation({
    mutationFn: (data: FormData) => AddLeadsFromExcelQuery(data),
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

  const columns: Column<ILeads>[] = [
    { header: "LinkedIn Profile", accessor: "linkedInProfile" },
    { header: "Email", accessor: "email" },
    { header: "Mobile No", accessor: "number" },
    { header: "Post", accessor: "post" },
    {
      header: "Date Time",
      accessor: "dateTime",
      render: (row: ILeads) => dayjs(row.dateTime).format("DD-MM-YYYY hh:mm A"),
    },
    { header: "Remarks", accessor: "remarks" },
    {
      header: "Action",
      render: (row) => (
        <div className="flex gap-3">
          {/* Person Edit (Stacked Icon) */}
          <FaUserEdit
            onClick={() => navigate(`/Leads/Edit-Leads`, { state: row })}
            className="text-[rgb(159,145,251)]  text-[18px] hover:text-[rgb(105,90,209)] cursor-pointer transition-all duration-200 hover:scale-110"
            title="Edit"
          />
          {/* Empty Trash */}
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-[#FF4C4C] hover:text-[#cc0000]  text-[15px] cursor-pointer transition-all duration-200 hover:scale-110"
            title="Delete"
            onClick={() => handleDeleteClick(row.leadsId)}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <BreadCrumbsComponent />
      <div className="bg-base-100 min-h-[780px] p-3 rounded-lg shadow-md">
        <div className="mx-5 mt-5 mb-5">
          <div className="grid grid-cols-12 mb-5 items-center">
            <div className="col-span-2">
              <h1 className="text-2xl font-bold">Leads</h1>
            </div>
            <div className="flex justify-end col-span-8 pr-3">
              <SearchBar
                iconClass="right-0"
                className="transition-all p-2 pl-3 mr-12 border border-[rgb(202,194,255)] rounded-xl duration-300 ease-in-out focus:outline-none focus:ring-0 focus:border-[rgb(159,145,251)]"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="col-span-2 grid grid-cols-5 gap-4">
              <div className="col-span-4 ">
                <Button
                  type="button"
                  text="Add Lead"
                  onClick={() => navigate("/Leads/Add-Leads")}
                  className="bg-[rgb(66,42,213)] text-white  w-full "
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
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <>
            <ListTable<ILeads> columns={columns} data={data?.data || []} />
            <span className="flex justify-end items-center gap-2 mt-5 mr-8">
              <Pagination
                page={page}
                pageSize={pageSize}
                totalCount={data?.totalCount || 0}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                isShowSize={true}
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
    </>
  );
};
