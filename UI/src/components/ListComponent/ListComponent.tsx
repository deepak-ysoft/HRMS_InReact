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
  columns: Column<T>[];
  data: T[];
  showFilter?: boolean;
  filters?: Partial<Record<keyof T, (string | number)[]>>;
  showPagination?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  selectedFilters?: Partial<Record<keyof T, string | number>>;
  onFilterChange?: (filters: Partial<Record<keyof T, string | number>>) => void;
}

export function ListTable<
  T extends Record<string, string | number | File | null | undefined>
>({ columns, data }: ListTableProps<T>) {
  return (
    <div className="card z-0  ">
      <div className="card-body pt-0">
        <table className="table table-hover">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.accessor ?? col.header)}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
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
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
