import React, { useState } from "react";
import {
  Column,
  ListTable,
} from "../../../components/ListComponent/ListComponent";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import SearchBar from "../../../components/layout/SearchBar";
import Pagination from "../../../components/ListComponent/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { FaUserEdit } from "react-icons/fa";
import { ConfirmDelete } from "../../../components/DeletionConfirm/ConfirmDelete";
import { getEmployees } from "../../../services/Employee Management/Employee/GetEmployees.query";
import { deleteEmployee } from "../../../services/Employee Management/Employee/DeleteEmployee.query";
import { AttendanceMarkInQuery } from "../../../services/Employee Management/Attendance/AttendanceMarkIn.query";
import { AttendanceMarkOutQuery } from "../../../services/Employee Management/Attendance/AttendanceMarkOut.query";
import { toast } from "react-toastify";

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const apiPath = import.meta.env.VITE_API_BASE_URL;

  const { data, isPending, refetch } = useQuery({
    queryKey: ["getEmployees", page, pageSize, searchValue],
    queryFn: () => getEmployees({ page, pageSize, searchValue }),
  });

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const data = await deleteEmployee(deleteId);
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

  const handleMarkAttendance = async (empId: number, action: "in" | "out") => {
    setLoadingId(empId);
    const formData = new FormData();
    formData.append("employeeId", empId.toString());
    let response;
    if (action === "in") {
      response = await AttendanceMarkInQuery(formData);
    } else {
      response = await AttendanceMarkOutQuery(formData);
    }
    setLoadingId(null);
    if (response?.isSuccess) {
      toast.success(
        `Attendance marked ${
          action === "in" ? "IN" : "OUT"
        } for Employee ${empId}`
      );
    } else {
      toast.error(response?.message || "Failed to mark attendance.");
    }
  };

  const columns: Column<
    Record<string, string | number | File | null | undefined>
  >[] = [
    {
      header: "Name",
      accessor: "empName",
      render: (row) => {
        return (
          <>
            <div className="flex gap-4 justify-start items-center">
              <img
                src={`${apiPath + row.imagePath}`}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span>{String(row.empName)}</span>
            </div>
          </>
        );
      },
    },
    { header: "Email", accessor: "empEmail" },
    { header: "Mobile", accessor: "empNumber" },
    { header: "Job Title", accessor: "empJobTitle" },
    { header: "Experience", accessor: "empExperience" },
    {
      header: "IsActive",
      accessor: "isActive",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-2xl text-black text-sm flex justify-center  ${
            row.isActive
              ? "bg-green-50 border border-green-300"
              : "bg-red-50 border border-red-300"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Mark In",
      accessor: "markIn",
      render: (row) => (
        <Button
          type="button"
          text={loadingId === row.empId ? "Marking In..." : "Mark In"}
          className="bg-blue-500 text-white py-1 px-3 rounded"
          disabled={loadingId === row.empId}
          onClick={() => handleMarkAttendance(Number(row.empId), "in")}
        />
      ),
    },
    {
      header: "Mark Out",
      accessor: "markOut",
      render: (row) => (
        <Button
          type="button"
          text={loadingId === row.empId ? "Marking Out..." : "Mark Out"}
          className="bg-gray-500 text-white py-1 px-3 rounded"
          disabled={loadingId === row.empId}
          onClick={() => handleMarkAttendance(Number(row.empId), "out")}
        />
      ),
    },
    {
      header: "Action",
      accessor: "Action",
      render: (row) => (
        <div className="flex gap-3">
          <FontAwesomeIcon
            icon={faEye}
            onClick={() =>
              navigate(`/employees/Employee-Details`, { state: row })
            }
            className="text-[rgb(66,42,213)] text-[15px] hover:text-[rgb(43,36,85)] cursor-pointer transition-all duration-200 hover:scale-110"
            title="View"
          />
          <FaUserEdit
            onClick={() => navigate(`/employees/Edit-Employee`, { state: row })}
            className="text-[rgb(159,145,251)] text-[18px] hover:text-[rgb(105,90,209)] cursor-pointer transition-all duration-200 hover:scale-110"
            title="Edit"
          />
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-[#FF4C4C] hover:text-[#cc0000] text-[15px] cursor-pointer transition-all duration-200 hover:scale-110"
            title="Delete"
            onClick={() => handleDeleteClick(Number(row.empId))}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <BreadCrumbsComponent />
      <div className="bg-base-100 min-h-[78vh] p-3 rounded-lg shadow-md">
        <div className="mx-5 mt-3 mb-5">
          <div className="grid grid-cols-9 mb-3 items-center">
            <div className="col-span-2">
              <h1 className="text-2xl font-bold">Employees</h1>
            </div>
            <div className="flex justify-end col-span-6 pr-3">
              <SearchBar
                iconClass="right-0"
                className="transition-all p-2 pl-3 mr-12 border border-[rgb(202,194,255)] rounded-xl duration-300 ease-in-out focus:outline-none focus:ring-0 focus:border-[rgb(159,145,251)]"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="w-full">
              <Button
                type="button"
                text="Add Employee"
                onClick={() => navigate("/employees/Add-Employee")}
                className="bg-[rgb(66,42,213)] text-white rounded w-full"
              />
            </div>
          </div>
        </div>
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <>
            <ListTable columns={columns} data={data?.res.list || []} />
            <span className="flex justify-end items-center gap-2 mt-3 mr-8">
              <Pagination
                page={page}
                pageSize={pageSize}
                totalCount={data?.res.totalCount || 0}
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
    </>
  );
};

export default EmployeesPage;
