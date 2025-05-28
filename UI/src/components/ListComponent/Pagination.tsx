import React from "react";
import CustomInput from "../FormFieldComponent/InputComponent";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  isShowSize?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  isShowSize = false,
}) => {
  const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;

  return (
    <>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mb-4 w-full pl-5">
          <nav aria-label="Page navigation ">
            <ul className="flex justify-end items-center gap-2">
              <li className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
              </li>
              <li>
                <button
                  className={`btn btn-sm ${
                    page === 1 ? "btn-primary text-white" : "btn-outline"
                  }`}
                  onClick={() => onPageChange(1)}
                >
                  1
                </button>
              </li>
              {page > 3 && (
                <li>
                  <span className="btn btn-outline btn-sm cursor-default text-gray-500">
                    ...
                  </span>
                </li>
              )}
              {page !== 1 && page !== totalPages && (
                <li>
                  <button className="btn btn-primary btn-sm text-white">
                    {page}
                  </button>
                </li>
              )}
              {page < totalPages - 2 && (
                <li>
                  <span className="btn btn-outline btn-sm cursor-default text-gray-500">
                    ...
                  </span>
                </li>
              )}
              {totalPages !== 1 && (
                <li>
                  <button
                    className={`btn btn-sm ${
                      page === totalPages
                        ? "btn-primary text-white"
                        : "btn-outline"
                    }`}
                    onClick={() => onPageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </li>
              )}
              <li
                className={
                  page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>{" "}
          {isShowSize && (
            <CustomInput
              type="select"
              name="pageSize"
              label=""
              value={pageSize}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onPageSizeChange && onPageSizeChange(Number(e.target.value))
              }
              options={[5, 10, 20, 50].map((size) => ({
                label: `${size}`,
                value: String(size),
              }))}
              className="ml-2 border rounded  py-1"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Pagination;
