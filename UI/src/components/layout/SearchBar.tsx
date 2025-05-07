import React, { useState } from "react";

const SearchBar: React.FC = () => {
  // const [searchQuery, setSearchQuery] = useState<string>("");
  const [showInput, setShowInput] = useState(false);
  const toggleSearch = () => setShowInput(!showInput);

  return (
    <div className="relative flex items-center space-x-2">
      <button className="btn btn-ghost btn-circle" onClick={toggleSearch}>
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

      {/* Search Input */}
      {/* <FormField
        type="input"
        inputType="text"
        name="searchQuery"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        required={false}
        className={`absolute right-12 transition-all duration-300 ease-in-out ${
          showInput ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none"
        }`}
      /> */}
    </div>
  );
};

export default SearchBar;
