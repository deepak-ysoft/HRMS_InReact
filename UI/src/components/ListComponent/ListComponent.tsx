import { useMemo, useState } from "react";
import CustomInput from "../FormFieldComponent/InputComponent";
import SearchBar from "../layout/SearchBar";

// Column definition
export interface Column<T> {
  header: string;
  accessor?: keyof T; // accessor is optional if using render
  render?: (row: T) => React.ReactNode; // <-- ALLOW custom rendering
}

// Props for the ListTable component
export interface ListTableProps<
  T extends Record<string, string | number | File | null | undefined>
> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  showSearch?: boolean;
  showFilter?: boolean;
  filters?: Partial<Record<keyof T, (string | number)[]>>;
  showPagination?: boolean;
  pageSize?: number;
}

export function ListTable<
  T extends Record<string, string | number | File | null | undefined>
>({
  columns,
  data,
  showSearch = true,
  showFilter = false,
  filters = {},
  showPagination = true,
  pageSize = 5,
}: ListTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<keyof T, string | number>>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const processed = useMemo(() => {
    let filtered = [...data];

    // Filters
    if (showFilter) {
      Object.entries(selectedFilters).forEach(([key, val]) => {
        if (val !== undefined && val !== "") {
          filtered = filtered.filter(
            (item) => String(item[key as keyof T]) === String(val)
          );
        }
      });
    }

    // Search
    if (showSearch && searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (v) => v !== undefined && String(v).toLowerCase().includes(term)
        )
      );
    }

    return filtered;
  }, [data, searchTerm, selectedFilters, showFilter, showSearch]);

  const totalPages = showPagination
    ? Math.ceil(processed.length / pageSize)
    : 1;

  const paginated = useMemo(() => {
    if (!showPagination) return processed;
    const start = (currentPage - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, currentPage, pageSize, showPagination]);

  const handleFilterChange = (field: keyof T, value: string | number) => {
    setSelectedFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="grid grid-cols-12 mb-3 gap-2">
          {/* Empty left space */}

          {/* Right aligned search and filter */}
          <div className="col-span-12 flex justify-between items-center gap-2 relative">
            {(showSearch || showFilter) && (
              <>
                <div className="pb-9">
                  {showSearch && (
                    <SearchBar
                      className="transition-all p-2 pl-3 border border-[rgb(202,194,255)] rounded-xl duration-300 ease-in-out absolute ml-3 focus:outline-none focus:ring-0 focus:border-[rgb(159,145,251)]"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  )}
                </div>
                <div className="">
                  {showFilter &&
                    Object.entries(filters).map(([field, options]) => (
                      <CustomInput
                        key={field}
                        label=""
                        name={`filter-${field}`}
                        className="form-control w-full "
                        type="select"
                        value={
                          selectedFilters[field as keyof T]?.toString() || ""
                        }
                        options={
                          options?.map((opt) => ({
                            label: String(opt),
                            value: String(opt),
                          })) || []
                        }
                        onChange={(e) =>
                          handleFilterChange(field as keyof T, e.target.value)
                        }
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.accessor ?? col.header)}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={String(col.accessor ?? col.header)}>
                    {col.render
                      ? col.render(row)
                      : typeof row[col.accessor as keyof T] === "object" &&
                        row[col.accessor as keyof T] !== null
                      ? (row[col.accessor as keyof T] as File).name
                      : row[col.accessor as keyof T]?.toString() ?? ""}
                  </td>
                ))}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showPagination && totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
