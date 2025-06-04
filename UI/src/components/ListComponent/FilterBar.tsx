import { FormField } from "../FormFieldComponent/FormFieldComponent";

interface FilterBarProps<T> {
  filters: Partial<Record<keyof T, (string | number)[]>>;
  selectedFilters: Partial<Record<keyof T, string | number>>;
  onFilterChange: (filters: Partial<Record<keyof T, string | number>>) => void;
  className?: string;
}

export function FilterBar<T>({
  filters,
  selectedFilters,
  onFilterChange,
  register,
  className,
}: FilterBarProps<T>) {
  const handleFilterChange = (field: keyof T, value: string | number) => {
    const newFilters = { ...selectedFilters, [field]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {Object.entries(filters).map(([field, options]) => (
        <FormField
          key={field}
          name={`filter-${field}`}
          className="form-control w-full"
          type="select"
          options={
            Array.isArray(options)
              ? options?.map((opt) => ({
                  label: String(opt),
                  value: String(opt),
                }))
              : []
          }
          onChange={(e) => handleFilterChange(field as keyof T, e.target.value)}
          register={register}
        />
      ))}
    </div>
  );
}
