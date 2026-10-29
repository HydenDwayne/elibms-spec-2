import { useState } from "react";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const SlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 4v6M6 14v6M12 4v2M12 10v10M18 4v10M18 18v2" />
    <circle cx="6" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="8" r="2" fill="currentColor" />
    <circle cx="18" cy="16" r="2" fill="currentColor" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/* Dummy Data Defaults */
const DUMMY_DATE_OPTIONS = [
  { value: "jan", label: "Jan" },
  { value: "feb", label: "Feb" },
  { value: "mar", label: "Mar" },
  { value: "apr", label: "Apr" },
  { value: "may", label: "May" },
  { value: "jun", label: "Jun" },
  { value: "jul", label: "Jul" },
  { value: "aug", label: "Aug" },
  { value: "sep", label: "Sep" },
  { value: "oct", label: "Oct" },
  { value: "nov", label: "Nov" },
  { value: "dec", label: "Dec" },
];

const DUMMY_CATEGORIES = [
  { value: "available", label: "Available" },
  { value: "borrowed", label: "Borrowed" },
  { value: "returned", label: "Returned" },
  { value: "overdue", label: "Overdue" },
  { value: "archived", label: "Archived" },
];

/* Default Initial Selected Filter Values */
const INITIAL_FILTERS = {
  dateFrom: "jan",
  dateTo: "jun",
  patron: "",
  category: "available",
};

const EMPTY = { dateFrom: "", dateTo: "", patron: "", category: "" };

/* Shared class strings */
const labelCls =
  "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500";

const fieldCls =
  "h-[26px] rounded-lg border border-[#d9d3cc] bg-[#ebe7e2] text-[11px] text-slate-700";

const selectCls =
  `${fieldCls} cursor-pointer appearance-none pl-2.5 pr-6 ` +
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] " +
  "bg-no-repeat bg-[position:right_8px_center] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a6c94]";

const btnCls =
  "inline-flex h-[26px] items-center justify-center gap-1.5 rounded-lg px-3.5 " +
  "text-[10px] font-bold uppercase tracking-wide text-white transition " +
  "hover:brightness-110 active:translate-y-px " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a6c94] " +
  "max-sm:h-[34px] max-sm:flex-1";

export default function ReportFilters({
  dateOptions = DUMMY_DATE_OPTIONS,
  categories = DUMMY_CATEGORIES,
  onApply,
  onReset,
}) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const update = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply?.(filters);
  };

  const handleReset = () => {
    setFilters(EMPTY);
    onReset?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="flex flex-wrap items-end gap-5 rounded-3xl bg-[#f0ece8] w-full px-[22px] py-5 font-sans text-slate-700 shadow-[0_4px_14px_rgba(60,40,30,0.12)] max-sm:gap-4"
    >
      {/* Date range */}
      <div className="flex flex-col gap-1.5">
        <span id="rf-date-label" className={labelCls}>Date range</span>
        <div role="group" aria-labelledby="rf-date-label" className="flex items-center gap-2">
          <select
            aria-label="From"
            value={filters.dateFrom}
            onChange={update("dateFrom")}
            className={`${selectCls} w-[68px]`}
          >
            <option value="" />
            {dateOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span aria-hidden="true" className="h-0.5 w-2.5 rounded-sm bg-[#1f2d3f]" />
          <select
            aria-label="To"
            value={filters.dateTo}
            onChange={update("dateTo")}
            className={`${selectCls} w-[68px]`}
          >
            <option value="" />
            {dateOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Patron */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="rf-patron" className={labelCls}>
          Patron <ChevronIcon />
        </label>
        <div
          className={`${fieldCls} flex w-62 items-center gap-1.5 px-2.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#4a6c94]`}
        >
          <input
            id="rf-patron"
            type="search"
            placeholder="Search"
            value={filters.patron}
            onChange={update("patron")}
            className="min-w-0 flex-1 bg-transparent font-[inherit] text-inherit outline-none placeholder:font-medium placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
          />
          <SearchIcon />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="rf-category" className={labelCls}>Status</label>
        <select
          id="rf-category"
          value={filters.category}
          onChange={update("category")}
          className={`${selectCls} w-50`}
        >
          <option value="" />
          {categories.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="ml-auto flex gap-2 max-sm:ml-0 max-sm:w-full">
        <button
          type="submit"
          className={`${btnCls} bg-gradient-to-r from-[#1f2d3f] to-[#4a6c94]`}
        >
          <SlidersIcon />
          Apply filters
        </button>
        <button
          type="reset"
          className={`${btnCls} bg-gradient-to-r from-[#a9553a] to-[#e8995a]`}
        >
          Reset
        </button>
      </div>
    </form>
  );
}