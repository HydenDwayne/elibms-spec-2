import { useState } from "react";
import { FaFilter } from "react-icons/fa6";

function SearchField({ value, onChange, filter, onFilterChange, placeholder, isBooks }) {
  const [showFilters, setShowFilters] = useState(false);

  const filters = ["All", "Title", "Author", "ISBN", "Genre"];

  return (
    <div className="relative">
      {/* For Search Input */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 w-60 rounded-sm
            border
            border-[#A35139]
            bg-white
            px-3
            pr-9
            text-xs
            text-[#53657a]
            outline-none
            placeholder:text-[#a8a8a8]
            focus:border-[#c96d45]
            transition-colors
            duration-200"
        />

        {isBooks && (
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              cursor-pointer"
            aria-label="Filter search"
          >
            <FaFilter size={13} strokeWidth={2} className="text-[#A35139]" />
          </button>
        )}
      </div>

      {/* For Filter Dropdown options */}
      {isBooks && showFilters && (
        <div className="absolute right-0 z-50 mt-1 w-[200px] overflow-hidden rounded-[4px] border border-[#A35139] bg-white shadow-md">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onFilterChange(item);
                setShowFilters(false);
              }}
              className={`block w-full px-3 py-2 text-left text-[10px] transition-colors
                ${filter === item ? "bg-[#f5e0d5] text-[#c96d45]" : "text-[#53657a] hover:bg-[#faf3ef]"}
              `}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchField;