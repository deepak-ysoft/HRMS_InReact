import React, { useState } from "react";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetLeave } from "../../../services/Employee Management/EmployeeLeave/GetLeave.query";
import {
  Column,
  ListTable,
} from "../../../components/ListComponent/ListComponent";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import Pagination from "../../../components/ListComponent/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaUserEdit } from "react-icons/fa";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ConfirmDelete } from "../../../components/DeletionConfirm/ConfirmDelete";
import { DeleteLeave } from "../../../services/Employee Management/EmployeeLeave/DeleteLeave.query";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { EmployeeLeave } from "../../../types/IEmployeeLeave.types";

export const LeavePage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const userId = localStorage.getItem("UserId");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const data = await DeleteLeave(deleteId);
    refetch();
    setShowDelete(false);
    setDeleteId(null);
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

  const { data, isPending, refetch } = useQuery({
    queryKey: ["getLeave", page, userId],
    queryFn: () => GetLeave(Number(userId), page),
  });

  console.log(data);

  const columns: Column<
    Record<string, string | number | File | null | undefined>
  >[] = [
    { header: "Leave For", accessor: "leaveFor" },
    {
      header: "Leave Type",
      accessor: "leaveType",
      render: (row) => (
        <>
          {row.leaveType === "FullDay"
            ? "Full Day"
            : row.leaveType === "EveningHalfDay"
            ? "EveningHalfDay"
            : row.leaveType === "MorningHalfDay"
            ? "Morning Half Day"
            : ""}
        </>
      ),
    },
    {
      header: "Start Date",
      accessor: "startDate",
      render: (row) => dayjs(row.startDate).format("DD-MM-YYYY hh:mm A"),
    },
    {
      header: "End Date",
      accessor: "endDate",
      render: (row) => dayjs(row.endDate).format("DD-MM-YYYY hh:mm A"),
    },
    {
      header: "Status",
      accessor: "isApprove",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-2xl text-black text-sm ${
            row.isApprove == "Panding"
              ? "bg-yellow-50 border border-yellow-300"
              : row.isApprove == "Approved"
              ? "bg-green-50 border border-green-300"
              : row.isApprove == "Rejected"
              ? "bg-red-50 border border-red-300"
              : "Rejected"
          }`}
        >
          {row.isApprove == "Panding"
            ? "Panding"
            : row.isApprove == "Approved"
            ? "Approved"
            : row.isApprove == "Rejected"
            ? "Rejected"
            : "-"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "Action",
      render: (row) => (
        <div className="flex gap-4">
          <FaUserEdit
            onClick={() => navigate(`/Leaves/AddEditLeave`, { state: row })}
            className="text-[rgb(159,145,251)] text-[18px] hover:text-[rgb(105,90,209)] cursor-pointer transition-all duration-200 hover:scale-110"
            title="Edit"
          />
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-[#FF4C4C] hover:text-[#cc0000] text-[15px] cursor-pointer transition-all duration-200 hover:scale-110"
            title="Delete"
            onClick={() => handleDeleteClick(Number(row.leaveId))}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <BreadCrumbsComponent />
      <div className="bg-base-100 min-h-[650px] p-3 rounded-lg shadow-md">
        <div className="mx-5 mt-3 mb-5">
          <div className="grid grid-cols-9 mb-3 items-center">
            <div className="col-span-8">
              <h1 className="text-2xl font-bold">Leaves</h1>
            </div>
            <div className="w-full flex justify-end">
              <Button
                type="button"
                text="Add Employee"
                onClick={() => navigate("/Leaves/AddEditLeave")}
                className="bg-[rgb(66,42,213)] text-white rounded w-full"
              />
            </div>
          </div>
        </div>
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <>
            <ListTable columns={columns} data={data?.data || []} />
            <span className="flex justify-end items-center gap-2 mt-3 mr-8">
              <Pagination
                page={page}
                pageSize={10}
                totalCount={data?.totalCount || 0}
                onPageChange={setPage}
                onPageSizeChange={() => {}}
              />
            </span>
          </>
        )}
      </div>{" "}
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
