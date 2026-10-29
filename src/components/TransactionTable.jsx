import { useNavigate } from "react-router-dom";

function TransactionTable({ transactions }) {
  const navigate = useNavigate();

  const handleBookRowClick = (transactionId) => {
    navigate(`/books/${transactionId}`);
  };

  const handlePatronRowClick = (transactionId) => {
    navigate(`/patrons/${transactionId}`);
  };

  const tableHeader = "text-sm font-medium text-[#A35139]";

  return (
    <>
      <div className=" overflow-hidden rounded-[2px] border border-[#eee7e3] bg-white">
        <div className="transaction-scroll h-85 overflow-y-clip">
          <table className="w-full table-fixed border-collapse">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="h-[35px] text-center border-b border-[#F6A85E]">
                <th className={tableHeader}>#</th>

                <th className={tableHeader}>Book</th>

                <th className={tableHeader}>Patron</th>

                <th className={tableHeader}>Date</th>

                <th className={tableHeader}>Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="
                  h-[35px]
                  border-b border-[#F6A85E]
                  text-center
                "
                >
                  <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                    {transaction.id}
                  </td>

                  {/* for book n patron, clickable sila
                    once click, pupunta na sa book details or patron details */}

                  <td
                    onClick={() => {
                      if (transaction.book?.id) {
                        handleBookRowClick(transaction.book.id);
                      }
                    }}
                    className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]
                    h-[35px]
                    border-b border-[#F6A85E]
                    cursor-pointer
                    transition-colors
                    hover:bg-[#faf3ef]
                    text-center
                  "
                  >
                    <div className="truncate">
                      {transaction.book?.title || "—"}
                    </div>
                  </td>

                  <td
                    onClick={() => {
                      if (transaction.patron?.id) {
                        handlePatronRowClick(transaction.patron.id);
                      }
                    }}
                    className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]
                    h-[35px]
                    border-b border-[#F6A85E]
                    cursor-pointer
                    transition-colors
                    hover:bg-[#faf3ef]
                    text-center
                  "
                  >
                    <div className="truncate">
                      {transaction.patron?.name || "—"}
                    </div>
                  </td>

                  <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                    {transaction.date}
                  </td>

                  <td className="px-[12px] py-0">
                    <TransactionStatus status={transaction.status} />
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="h-[60px] text-center text-[8px] text-[#a8a8a8]"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end pt-2 pr-2">
        <p className="text-sm text-[#AA563F] font-medium">{"< 1 2 3 4 5 >"}</p>
      </div>
    </>
  );
}

function TransactionStatus({ status }) {
  const statusStyles = {
    Borrowed: `bg-[#A35139] text-white border border-[#A35139]`,
    Returned: `bg-[#e9edf0] text-[#53657a] border border-[#e9edf0]`,
    Overdue: `bg-[#f0f1f2] text-[#A35139] border border-[#f0f1f2]`,
  };

  return (
    <span
      className={`
        inline-flex
        h-[28px]
        min-w-[75px]
        items-center
        justify-center
        rounded-full
        px-[10px]
        text-[9px]
        font-normal
        leading-none
        ${statusStyles[status] || `bg-[#e9edf0] text-[#A35139] border border-[#e9edf0] `}
      `}
    >
      {status}
    </span>
  );
}

export default TransactionTable;

// ====== ADD THIS INDEX.CSS ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧ ======

// .transaction-scroll::-webkit-scrollbar {
//   width: 5px;
// }

// .transaction-scroll::-webkit-scrollbar-track {
//   background: #f5f1ef;
// }

// .transaction-scroll::-webkit-scrollbar-thumb {
//   background: #F6A85E;
//   border-radius: 10px;
// }

// .transaction-scroll::-webkit-scrollbar-thumb:hover {
//   background: #A35139;
// }
