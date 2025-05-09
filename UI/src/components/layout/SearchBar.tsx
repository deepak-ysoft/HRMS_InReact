import React, { useState } from "react";
import CustomInput from "../FormFieldComponent/InputComponent";

interface SearchBarProps {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ className, onChange }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showInput, setShowInput] = useState(false);
  const toggleSearch = () => setShowInput(!showInput);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <CustomInput
        label=""
        type="search"
        name="searchQuery"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search..."
        required={false}
        className={`${className} ml-12 ${
          showInput ? "w-60 opacity-100" : "w-0 opacity-0 pointer-events-none"
        }`}
      />
      <button
        className="btn btn-ghost btn-circle absolute bg-[rgb(202,194,255)] text-black"
        onClick={toggleSearch}
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
