import React from "react";
import { useForm } from "react-hook-form";
import { FormField } from "../FormFieldComponent/FormFieldComponent";

interface SearchBarProps {
  iconClass?: string;
  className?: string;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  showInput: boolean;
  setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
}

type SearchFormValues = {
  searchQuery: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  iconClass,
  className,
  onChange,
  showInput,
  setShowInput,
}) => {
  const { setValue, watch, register, trigger } = useForm<SearchFormValues>({
    defaultValues: { searchQuery: "" },
  });

  const searchQuery = watch("searchQuery");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setValue("searchQuery", e.target.value);
    trigger("searchQuery");

    if (onChange) {
      setTimeout(() => {
        onChange(e); // Call parent's onChange
      }, 500);
    }
  };

  const handleClear = () => {
    setValue("searchQuery", "");
    if (onChange) {
      onChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Search Input */}
      <div className="relative mt-4 mr-12">
        <FormField
          onChange={handleInputChange}
          type="text"
          name="searchQuery"
          placeholder="Search..."
          className={`transition-all duration-300 ${
            showInput
              ? "w-60 opacity-100 pr-1"
              : "w-0 opacity-0 pointer-events-none"
          } ${className}`}
          register={register}
        />

        {/* Clear (X) button */}
        {showInput && searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-4 text-2xl z-10 -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none"
            title="Clear"
          >
            &times;
          </button>
        )}
      </div>

      {/* Toggle Search Icon */}
      <button
        className={`${iconClass} btn btn-ghost btn-circle absolute bg-[rgb(202,194,255)] text-black`}
        onClick={() => setShowInput(!showInput)}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Search</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
