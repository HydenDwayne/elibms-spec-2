import { useNavigate } from "react-router-dom";

function PatronBorrowingHistoryTable({ transactions = [] }) {
  const navigate = useNavigate();

    const handleBookRowClick = (bookId) => {
    navigate(`/books/${bookId}`);
  }

  return (
    <div className="w-full overflow-hidden rounded-[2px] border border-[#eee7e3] bg-white">
      <div className="transaction-scroll h-[175px] overflow-y-auto">
        <table className="w-full table-fixed border-collapse">

          <thead className="sticky top-0 z-10 bg-white">
            <tr className="h-[35px] text-center border-b border-[#F6A85E]">

              <th className="w-[7%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
                #
              </th>

              <th className="w-[24%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
                Book
              </th>

              <th className="w-[18%] px-[10px] text-sm font-bold leading-none text-[#A35139]">
                Borrowed
              </th>

              <th className="w-[16%] px-[10px] text-sm font-bold leading-none text-[#A35139]">
                Date
              </th>

              <th className="w-[18%] px-[10px] text-sm font-bold leading-none text-[#A35139]">
                Returned
              </th>

              <th className="w-[18%] px-[10px] text-sm font-bold leading-none text-[#A35139]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className="
                  h-[35px]
                  border-b border-[#F6A85E]
                  text-center
                "
              >
                <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                  {index + 1}
                </td>

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

                  {transaction.book?.title || "—"}
                </td>

                <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                  {transaction.borrowedDate ||
                    transaction.date}
                </td>

                <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                  {transaction.dueDate || transaction.date}
                </td>

                <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                  {transaction.returnedDate}
                </td>

                <td className="px-[12px] py-0">
                  <TransactionStatus status={transaction.status} />
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="h-[60px] text-center text-[8px] text-[#a8a8a8]">
                  No borrowing history.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
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

export default PatronBorrowingHistoryTable;

