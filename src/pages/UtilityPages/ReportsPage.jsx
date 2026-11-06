import { useState, useMemo } from "react";
import CirculationActivity from "../../components/CirculationActivity";
import Filters from "../../components/ReportFilters";
import BookInventoryStatus from "../../components/BookInventoryStatus";
import BorrowingActivityTable from "../../components/BorrowingActivityTable";

import data from "../../data/dummy_data.json";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const EMPTY_FILTERS = { dateFrom: "", dateTo: "", search: "", category: "" };

const ymOf = (iso) => Number(iso.slice(0, 4)) * 12 + Number(iso.slice(5, 7)) - 1;

const toRecord = (t) => {
  const book = data.books.find((b) => b.id === t.bookId);
  return {
    ...t,
    date: t.borrowedDate,
    book,
    patron: data.patrons.find((p) => p.id === t.patronId),
    status: book?.status === "Archived" ? "Archived" : t.status,
  };
};

const recentRecords = data.borrowingRecordIds
  .map((id) => data.transactions.find((x) => x.id === id))
  .filter(Boolean)
  .map(toRecord);

const allRecords = [...data.transactions]
  .sort(
    (a, b) =>
      b.borrowedDate.localeCompare(a.borrowedDate) || b.id.localeCompare(a.id)
  )
  .map(toRecord);

const borrowMonths = data.transactions.map((t) => ymOf(t.borrowedDate));
const MIN_YM = Math.min(...borrowMonths);
const MAX_YM = Math.max(...borrowMonths);

const YEARS = Array.from(
  { length: Math.floor(MAX_YM / 12) - Math.floor(MIN_YM / 12) + 1 },
  (_, i) => Math.floor(MIN_YM / 12) + i
);

const getRange = (f) => ({
  from: f.dateFrom ? ymOf(f.dateFrom) : MIN_YM,
  to: f.dateTo ? ymOf(f.dateTo) : MAX_YM,
});

const matchesSearch = (r, f) => {
  const term = f.search.trim().toLowerCase();
  if (!term) return true;
  return [
    r.id,
    r.bookId,
    r.patronId,
    r.borrowedDate,
    r.dueDate,
    r.returnedDate,
    r.status,
    r.book?.title,
    r.patron?.name,
    r.patron?.studentNumber,
    r.patron?.contactNo,
  ].some((v) => String(v ?? "").toLowerCase().includes(term));
};

const matchesStatus = (r, f) =>
  !f.category || r.status.toLowerCase() === f.category.toLowerCase();

const STOCK_STATUS_MAP = [
  ["Returned", "Available"],
  ["Borrowed", "Borrowed"],
  ["Archived", "Archived"],
  ["Overdue", "Overdue"],
];

const STOCK_INVENTORY = (() => {
  const total = data.books.length;
  return {
    total,
    statuses: STOCK_STATUS_MAP.map(([label, bookStatus]) => {
      const count = data.books.filter((b) => b.status === bookStatus).length;
      return {
        label,
        count,
        percentage: total ? Math.round((count / total) * 100) : 0,
      };
    }),
  };
})();

const fmtYM = (ym) =>
  `${String((ym % 12) + 1).padStart(2, "0")}/${Math.floor(ym / 12)}`;

const ReportsPage = () => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const { from, to } = getRange(filters);
  const isFiltered = Object.values(filters).some(Boolean);

  const filteredRecords = useMemo(() => {
    if (!isFiltered) return recentRecords;
    const range = getRange(filters);
    return allRecords.filter((r) => {
      const m = ymOf(r.borrowedDate);
      return (
        m >= range.from &&
        m <= range.to &&
        matchesSearch(r, filters) &&
        matchesStatus(r, filters)
      );
    });
  }, [filters, isFiltered]);

  const inventoryData = useMemo(() => {
    if (!isFiltered) return STOCK_INVENTORY; 

    const total = filteredRecords.length;

    return {
      total,
      subtitle: "Matching transactions",
      statuses: ["Returned", "Borrowed", "Archived", "Overdue"].map((label) => {
        const count = filteredRecords.filter((r) => r.status === label).length;
        return {
          label,
          count,
          percentage: total ? Math.round((count / total) * 100) : 0,
        };
      }),
    };
  }, [filteredRecords, isFiltered]);

  const chartData = useMemo(() => {
    const range = getRange(filters);
    const base = allRecords.filter(
      (r) => matchesSearch(r, filters) && matchesStatus(r, filters)
    );
    const spansYears = Math.floor(range.from / 12) !== Math.floor(range.to / 12);

    const months = [];
    for (let m = range.from; m <= range.to; m++) {
      const label = MONTH_LABELS[m % 12];
      months.push({
        month: spansYears ? `${label} '${String(Math.floor(m / 12)).slice(2)}` : label,
        borrows: base.filter((r) => ymOf(r.borrowedDate) === m).length,
        returns: base.filter(
          (r) => r.returnedDate && ymOf(r.returnedDate) === m
        ).length,
      });
    }
    return months;
  }, [filters]);

  const rangeLabel = `${fmtYM(from)} - ${fmtYM(to)}`;

  return (
    <div className="px-15 py-10 w-full h-full overflow-y-auto">
      <p className="text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        REPORTS
      </p>

      <div>
        <div className="flex flex-col px-15 mt-5">
          <div>
            <Filters
              years={YEARS}
              onApply={setFilters}
              onReset={() => setFilters(EMPTY_FILTERS)}
            />

            <p className="mb-3 text-2xl font-semibold mt-5 bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
              Inventory Status
            </p>
            <div className="flex flex-row gap-4">
              <BookInventoryStatus inventory={inventoryData} />
              <CirculationActivity data={chartData} rangeLabel={rangeLabel} />
            </div>

            <p className="text-[#AA563F] font-semibold mt-10">
              {isFiltered ? "Filtered Transactions" : "Recent Transactions"}
            </p>
            <BorrowingActivityTable records={filteredRecords} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
