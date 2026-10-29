import { useState } from "react";
import data from "../data/dummy_data.json";

const statusStyles = {
  Borrowed: {
    color: "#A04E35",
    textColor: "#FFFFFF",
    itemCountColor: "#000000",
    itemPercentageColor: "#A8A29E",
    filled: true,
  },
  Returned: {
    color: "#E3EEF8",
    textColor: "#075985",
    itemCountColor: "#000000",
    itemPercentageColor: "#A8A29E",
    filled: true,
  },
  Archived: {
    color: "#E9C46A",
    textColor: "#A04E35",
    itemCountColor: "#000000",
    itemPercentageColor: "#A8A29E",
    filled: false,
  },
  Overdue: {
    color: "#BE123C",
    textColor: "#BE123C",
    itemCountColor: "#BE123C",
    itemPercentageColor: "#FB7185",
    filled: false,
  },
};

// Local sample data matching your structure (make sure percentages add up to 100)
const INITIAL_INVENTORY = data.dashboard.inventory;

function BookInventoryStatus() {
  // Initialize state directly with the local data object
  const [inventory] = useState(INITIAL_INVENTORY);

  if (!inventory) return null;

  return (
    <div className="flex h-full min-h-[300px] w-full flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">
            Book Inventory Status
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Total stock distribution
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#F5F5F3] px-3 py-2 text-xs font-semibold text-black-800">
          {inventory.total} Total
        </span>
      </div>

      <div
        className="mt-7 flex h-3.5 w-full shrink-0 overflow-hidden rounded-full"
        role="img"
        aria-label="Inventory status distribution"
      >
        {inventory.statuses.map((item) => {
          const style = statusStyles[item.label];

          if (!style) return null;

          return (
            <div
              key={item.label}
              title={`${item.label}: ${item.percentage}%`}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: style.color,
              }}
              className="h-full shrink-0"
            />
          );
        })}
      </div>

      <div className="mt-auto grid grid-cols-1 gap-2 pt-6 sm:grid-cols-2">
        {inventory.statuses.map((item) => {
          const style = statusStyles[item.label];

          if (!style) return null;

          return (
            <div
              key={item.label}
              className="flex min-h-[76px] items-center justify-between gap-2 rounded-xl border border-gray-200 bg-[#FCFBF8] px-3 py-3"
            >
              <span
                className="inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: style.filled
                    ? style.color
                    : "transparent",
                  borderColor: style.color,
                  color: style.textColor,
                }}
              >
                {item.label}
              </span>

              <div className="shrink-0 text-right">
                <p
                  className="text-sm font-bold"
                  style={{ color: style.itemCountColor }}>
                  {item.count}
                </p>

                <p
                  className="mt-1 text-xs"
                  style={{ color: style.itemPercentageColor }}>
                  ({item.percentage}%)
                </p>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookInventoryStatus;
