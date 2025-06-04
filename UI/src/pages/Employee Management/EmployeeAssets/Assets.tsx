import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetAssets } from "../../../services/Employee Management/EmployeeAssets/GetAssets.query";
import {
  Column,
  ListTable,
} from "../../../components/ListComponent/ListComponent";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaUserEdit } from "react-icons/fa";
import { faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ConfirmDelete } from "../../../components/DeletionConfirm/ConfirmDelete";
import { DeleteAssets } from "../../../services/Employee Management/EmployeeAssets/DeleteAssets.query";
import { EmployeeAsset } from "../../../types/IEmployeeAsset.types";
import Pagination from "../../../components/ListComponent/Pagination";
import { toast } from "react-toastify";

export const AssetsPage: React.FC<{
  onEdit?: (asset: Partial<EmployeeAsset>) => void;
  reloadKey?: number;
}> = ({ onEdit, reloadKey }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("UserId");
  const apiPath = import.meta.env.VITE_API_BASE_URL;
  const [page, setPage] = useState(1);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const data = await DeleteAssets(deleteId);
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

  const handleEdit = (
    row: Record<string, string | number | File | null | undefined>
  ) => {
    if (onEdit) {
      // Map row keys to match EmployeeAsset interface
      onEdit({
        assetId: Number(row.assetId ?? row.AssetId),
        assetName: String(row.assetName ?? row.AssetName ?? ""),
        description: String(row.description ?? row.Description ?? ""),
        imagePath: String(row.imagePath ?? row.ImagePath ?? ""),
        image: null,
        empId: Number(row.empId ?? row.EmpId ?? 0),
      });
    }
  };

  const { data, isPending, refetch } = useQuery({
    queryKey: ["getAssets", userId, page, reloadKey],
    queryFn: () => GetAssets(Number(userId), page),
  });
  const columns: Column<
    Record<string, string | number | File | null | undefined>
  >[] = [
    {
      header: "Asset Name",
      accessor: "assetName",
      render: (row) => {
        return (
          <>
            <div className="flex gap-4 justify-start items-center">
              <img
                src={`${apiPath + row.imagePath}`}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span>{String(row.assetName)}</span>
            </div>
          </>
        );
      },
    },
    { header: "Description", accessor: "description" },
    {
      header: "Action",
      accessor: "Action",
      render: (row) => (
        <div className="flex gap-4">
          <FontAwesomeIcon
            icon={faEye}
            onClick={() =>
              navigate(`/employees/EmployeeDetails`, { state: row })
            }
            className="text-[rgb(66,42,213)] text-[15px] hover:text-[rgb(43,36,85)] cursor-pointer transition-all duration-200 hover:scale-110"
            title="View"
          />
          <FaUserEdit
            onClick={() => handleEdit(row)}
            className="text-[rgb(159,145,251)] text-[18px] hover:text-[rgb(105,90,209)] cursor-pointer transition-all duration-200 hover:scale-110"
            title="Edit"
          />
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-[#FF4C4C] hover:text-[#cc0000] text-[15px] cursor-pointer transition-all duration-200 hover:scale-110"
            title="Delete"
            onClick={() =>
              handleDeleteClick(Number(row.assetId ?? row.AssetId))
            }
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <BreadCrumbsComponent />
      <div className="bg-base-100 min-h-[780px] p-3 rounded-lg shadow-md">
        <div className="mx-5 mt-3 mb-5">
          <div className=" mb-3 items-center">
            <h1 className="text-2xl font-bold">Assets</h1>
          </div>
        </div>
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <>
            <ListTable columns={columns} data={data.data || []} />
            <span className="flex justify-end items-center gap-2 mt-3 mr-8">
              <Pagination
                page={page}
                pageSize={10}
                totalCount={data?.totalCount || 0}
                onPageChange={setPage}
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
