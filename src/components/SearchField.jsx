import { useState, useRef, useEffect } from "react";
import { FaFilter } from "react-icons/fa6";

const BOOK_FILTERS = ["All", "Title", "Author", "ISBN", "Genre"];

function SearchField({
  value,
  onChange,
  filter,
  onFilterChange,
  placeholder,
  isBooks,
  filterOptions, // optional: custom dropdown options for other pages
}) {
  const [showFilters, setShowFilters] = useState(false);
  const wrapperRef = useRef(null);

  // Custom options win; otherwise books get the book filters; otherwise no dropdown
  const filters = filterOptions ?? (isBooks ? BOOK_FILTERS : null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
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

        {filters && (
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
      {filters && showFilters && (
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