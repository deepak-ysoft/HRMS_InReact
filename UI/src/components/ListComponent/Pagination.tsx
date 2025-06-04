import React from "react";
import { useForm } from "react-hook-form";
import { FormField } from "../FormFieldComponent/FormFieldComponent";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  isShowSize?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

type PageSizeForm = {
  pageSize: number;
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  isShowSize = false,
}) => {
  const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;

  // Use react-hook-form for pageSize select, like MyForm.tsx
  const { register, setValue } = useForm<PageSizeForm>({
    defaultValues: { pageSize },
  });

  // Handler for page size change
  const handlePageSizeChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLSelectElement;
    const newSize = Number(target.value);
    setValue("pageSize", newSize);

    if (typeof onPageSizeChange === "function") {
      onPageSizeChange(newSize);
    }
  };

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
          </nav>
          {isShowSize && (
            <div className="ml-2 min-w-[90px]">
              <FormField
                type="select"
                name="pageSize"
                label=""
                register={register}
                onChange={handlePageSizeChange}
                options={[10, 20, 50].map((size) => ({
                  label: `${size}`,
                  value: String(size),
                }))}
                className="border rounded py-1"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Pagination;
