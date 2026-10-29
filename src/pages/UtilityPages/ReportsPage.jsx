import CirculationActivity from "../../components/CirculationActivity";
import Filters from "../../components/ReportFilters";
import BookInventoryStatus from "../../components/BookInventoryStatus";
import BorrowingActivityTable from "../../components/BorrowingActivityTable";
import { LuNfc } from "react-icons/lu";

import data from "../../data/dummy_data.json";

const ReportsPage = () => {
  const circulationData = data.circulationByMonth;
  const borrowingRecords = data.borrowingRecordIds.map((id) => {
    const t = data.transactions.find((x) => x.id === id);
    return {
      ...t,
      date: t.borrowedDate,
      book: data.books.find((b) => b.id === t.bookId),
      patron: data.patrons.find((p) => p.id === t.patronId),
    };
  });

  return (
    <div className="px-15 py-10 w-full h-full overflow-y-auto">
      <p className=" text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        REPORTS
      </p>

      <div>
        <div className="flex flex-col px-15 mt-5">
          <div>
            <Filters />
            <p className="mb-3 text-2xl font-semibold mt-5 bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
              Inventory Status
            </p>
            <div className="flex flex-row gap-4">
              <BookInventoryStatus />
              <CirculationActivity data={circulationData} />
            </div>
            <p className="text-[#AA563F] font-semibold mt-10">
              Recent Transactions
            </p>
            <BorrowingActivityTable records={borrowingRecords} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
