import React, { useRef, useState } from "react";
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

export const LeavePage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const userId = localStorage.getItem("UserId");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await DeleteLeave(deleteId);
      refetch();
      setToastMsg("Employee deleted successfully!");
      setShowDelete(false);
      setDeleteId(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setToastMsg(null), 2500);
    } catch {
      setToastMsg("Error deleting employee!");
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

  const { data, isPending, refetch } = useQuery({
    queryKey: ["getLeave", page, userId],
    queryFn: () => GetLeave(Number(userId), page),
  });
  console.log("Leave", data);

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
    { header: "Start Date", accessor: "startDate" },
    { header: "End Date", accessor: "endDate" },
    {
      header: "Status",
      accessor: "isApprove",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-2xl text-black text-sm ${
            row.isApprove
              ? "bg-green-50 border border-green-300"
              : "bg-red-50 border border-red-300"
          }`}
        >
          {row.isApprove ? "Approved" : "Rejected"}
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
