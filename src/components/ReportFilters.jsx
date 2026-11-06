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
const MONTH_OPTIONS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const DUMMY_CATEGORIES = [
  { value: "borrowed", label: "Borrowed" },
  { value: "returned", label: "Returned" },
  { value: "overdue", label: "Overdue" },
  { value: "archived", label: "Archived" },
];

/* Default Initial Selected Filter Values (no filtering) */
const EMPTY = {
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
  search: "",
  category: "",
};

const toYM = (year, month) => Number(year) * 12 + Number(month) - 1;

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
  months = MONTH_OPTIONS,
  years = [new Date().getFullYear()],
  categories = DUMMY_CATEGORIES,
  onApply,
  onReset,
}) {
  const [filters, setFilters] = useState(EMPTY);

  const update = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const { fromMonth, fromYear, toMonth, toYear } = filters;

  let error = "";
  if (!fromMonth !== !fromYear || !toMonth !== !toYear) {
    error = "Pick both a month and a year.";
  } else if (
    fromMonth && toMonth &&
    toYM(fromYear, fromMonth) > toYM(toYear, toMonth)
  ) {
    error = "\u201cFrom\u201d can\u2019t be later than \u201cTo\u201d.";
  }

  const sameYear = fromYear && toYear && Number(fromYear) === Number(toYear);
  const fromYearDisabled = (y) => toYear && y > Number(toYear);
  const toYearDisabled = (y) => fromYear && y < Number(fromYear);
  const fromMonthDisabled = (m) => sameYear && toMonth && Number(m) > Number(toMonth);
  const toMonthDisabled = (m) => sameYear && fromMonth && Number(m) < Number(fromMonth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) return;
    onApply?.({
      dateFrom: fromMonth ? `${fromYear}-${fromMonth}` : "",
      dateTo: toMonth ? `${toYear}-${toMonth}` : "",
      search: filters.search,
      category: filters.category,
    });
  };

  const handleReset = () => {
    setFilters(EMPTY);
    onReset?.();
  };

  const monthSelect = (label, key, isDisabled) => (
    <select
      aria-label={`${label} month`}
      value={filters[key]}
      onChange={update(key)}
      className={`${selectCls} w-[68px]`}
    >
      <option value="">Month</option>
      {months.map((o) => (
        <option key={o.value} value={o.value} disabled={isDisabled(o.value)}>
          {o.label}
        </option>
      ))}
    </select>
  );

  const yearSelect = (label, key, isDisabled) => (
    <select
      aria-label={`${label} year`}
      value={filters[key]}
      onChange={update(key)}
      className={`${selectCls} w-[64px]`}
    >
      <option value="">Year</option>
      {years.map((y) => (
        <option key={y} value={y} disabled={isDisabled(y)}>
          {y}
        </option>
      ))}
    </select>
  );

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
          {monthSelect("From", "fromMonth", fromMonthDisabled)}
          {yearSelect("From", "fromYear", fromYearDisabled)}
          <span aria-hidden="true" className="h-0.5 w-2.5 rounded-sm bg-[#1f2d3f]" />
          {monthSelect("To", "toMonth", toMonthDisabled)}
          {yearSelect("To", "toYear", toYearDisabled)}
        </div>
        {error && (
          <span role="alert" className="text-[10px] font-medium text-[#a9553a]">
            {error}
          </span>
        )}
      </div>

      {/* Search (transaction ID, book, patron, status, date, ...) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="rf-search" className={labelCls}>
          Search <ChevronIcon />
        </label>
        <div
          className={`${fieldCls} flex w-62 items-center gap-1.5 px-2.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#4a6c94]`}
        >
          <input
            id="rf-search"
            type="search"
            placeholder="Search ID, book, patron, ..."
            value={filters.search}
            onChange={update("search")}
            className="min-w-0 flex-1 bg-transparent font-[inherit] text-inherit outline-none placeholder:font-medium placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
          />
          <SearchIcon />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="rf-category" className={labelCls}>Status</label>
        <select
          id="rf-category"
          value={filters.category}
          onChange={update("category")}
          className={`${selectCls} w-50`}
        >
          <option value="">All</option>
          {categories.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="ml-auto flex gap-2 max-sm:ml-0 max-sm:w-full">
        <button
          type="submit"
          disabled={!!error}
          className={`${btnCls} bg-gradient-to-r from-[#1f2d3f] to-[#4a6c94] disabled:cursor-not-allowed disabled:opacity-50`}
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