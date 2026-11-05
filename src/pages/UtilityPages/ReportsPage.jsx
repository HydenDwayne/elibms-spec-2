import { useState, useMemo } from "react";
import CirculationActivity from "../../components/CirculationActivity";
import Filters from "../../components/ReportFilters";
import BookInventoryStatus from "../../components/BookInventoryStatus";
import BorrowingActivityTable from "../../components/BorrowingActivityTable";

import data from "../../data/dummy_data.json";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const EMPTY_FILTERS = { dateFrom: "", dateTo: "", patron: "", category: "" };

const monthIndex = (isoDate) => Number(isoDate.slice(5, 7)) - 1;

const toRecord = (t) => ({
  ...t,
  date: t.borrowedDate,
  book: data.books.find((b) => b.id === t.bookId),
  patron: data.patrons.find((p) => p.id === t.patronId),
});

// Default view: the 10 most recent transactions
const recentRecords = data.borrowingRecordIds
  .map((id) => data.transactions.find((x) => x.id === id))
  .filter(Boolean)
  .map(toRecord);

// Filtered view searches every transaction, newest first
const allRecords = [...data.transactions]
  .sort(
    (a, b) =>
      b.borrowedDate.localeCompare(a.borrowedDate) || b.id.localeCompare(a.id)
  )
  .map(toRecord);

const lastMonthWithData = Math.max(
  ...data.transactions.map((t) => monthIndex(t.borrowedDate))
);
const dataYear = data.transactions[0].borrowedDate.slice(0, 4);

// Month range chosen in the filter (swaps if From is after To)
const getRange = (f) => {
  let from = f.dateFrom ? MONTHS.indexOf(f.dateFrom) : 0;
  let to = f.dateTo ? MONTHS.indexOf(f.dateTo) : lastMonthWithData;
  if (from > to) [from, to] = [to, from];
  return { from, to };
};

const matchesPatron = (r, f) => {
  const term = f.patron.trim().toLowerCase();
  if (!term) return true;
  return [r.patron?.name, r.patron?.studentNumber].some((v) =>
    String(v ?? "").toLowerCase().includes(term)
  );
};

const matchesStatus = (r, f) =>
  !f.category || r.status.toLowerCase() === f.category.toLowerCase();

const ReportsPage = () => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const { from, to } = getRange(filters);
  const isFiltered = Object.values(filters).some(Boolean);

  // Transactions table
  const filteredRecords = useMemo(() => {
    if (!isFiltered) return recentRecords;
    const range = getRange(filters);
    return allRecords.filter((r) => {
      const m = monthIndex(r.borrowedDate);
      return (
        m >= range.from &&
        m <= range.to &&
        matchesPatron(r, filters) &&
        matchesStatus(r, filters)
      );
    });
  }, [filters, isFiltered]);

  // Inventory card: current status of the books in the matching transactions
  const inventoryData = useMemo(() => {
    if (!isFiltered) return null; // null → card shows its default numbers

    const bookIds = new Set(filteredRecords.map((r) => r.bookId));
    const books = data.books.filter((b) => bookIds.has(b.id));
    const total = books.length;

    // [label shown on card, status stored on the book]
    const map = [
      ["Returned", "Available"],
      ["Borrowed", "Borrowed"],
      ["Archived", "Archived"],
      ["Overdue", "Overdue"],
    ];

    return {
      total,
      statuses: map.map(([label, bookStatus]) => {
        const count = books.filter((b) => b.status === bookStatus).length;
        return {
          label,
          count,
          percentage: total ? Math.round((count / total) * 100) : 0,
        };
      }),
    };
  }, [filteredRecords, isFiltered]);

  // Circulation chart: patron + status filters, limited to the chosen months
  const chartData = useMemo(() => {
    const range = getRange(filters);
    const base = allRecords.filter(
      (r) => matchesPatron(r, filters) && matchesStatus(r, filters)
    );
    return MONTH_LABELS.slice(range.from, range.to + 1).map((label, i) => {
      const m = range.from + i;
      return {
        month: label,
        borrows: base.filter((r) => monthIndex(r.borrowedDate) === m).length,
        returns: base.filter(
          (r) => r.returnedDate && monthIndex(r.returnedDate) === m
        ).length,
      };
    });
  }, [filters]);

  const rangeLabel = `${String(from + 1).padStart(2, "0")}/${dataYear} - ${String(to + 1).padStart(2, "0")}/${dataYear}`;

  return (
    <div className="px-15 py-10 w-full h-full overflow-y-auto">
      <p className="text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        REPORTS
      </p>

      <div>
        <div className="flex flex-col px-15 mt-5">
          <div>
            <Filters
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