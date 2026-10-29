import { useNavigate } from "react-router-dom";

function BorrowingActivityTable({ records = [] }) {
  const navigate = useNavigate();

  const handleBookRowClick = (recordId) => {
    navigate(`/books/${recordId}`);
    }

  const handlePatronRowClick = (recordId) => {
      navigate(`/patrons/${recordId}`);
    }

  return (
      <div className="w-full overflow-hidden rounded-[2px] border border-[#eee7e3] bg-white">
        <div className="transaction-scroll h-[175px] overflow-y-auto">
          <table className="w-full table-fixed border-collapse">

            <thead className="sticky top-0 z-10 bg-white">
              <tr className="h-[35px] border-b border-[#F6A85E] text-center">

                <th className="w-[7%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
                #
              </th>

              <th className="w-[24%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
                Book
              </th>

              <th className="w-[24%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
                Patron
              </th>

              <th className="w-[16%] px-[10px] text-sm font-bold leading-none text-[#A35139]">
                Date
              </th>

              <th className="w-[18%] px-[10px] text-sm font-bold leading-none text-[#A35139]">
                Status
              </th>

              </tr>
            </thead>

            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="h-[35px] 
                  border-b border-[#F6A85E] 
                  text-center"
                >

                <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                    {record.id}
                  </td>

                  <td
                    onClick={() => {
                    if (record.book?.id) {
                      handleBookRowClick(record.book.id);
                    }
                  }}
                    className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]
                        h-[35px]
                        border-b border-[#F6A85E]
                        cursor-pointer
                        transition-colors
                        hover:bg-[#faf3ef]
                        text-center"
                    >
                    <div className="truncate">
                        {record.book?.title || "—"}
                    </div>
                    </td>

                  <td
                    onClick={() => {
                        if (record.patron?.id) {
                            handlePatronRowClick(record.patron.id);
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
                    {record.patron?.name || "—"}
                  </div>
                </td>

                  <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                    {record.date}
                  </td>

                  <td className="px-[12px] py-0">
                    <BorrowingStatus status={record.status} />
                  </td>
                </tr>
              ))}

              {records.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="h-[60px] text-center text-[8px] text-[#a8a8a8]"
                  >
                    No borrowing records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
}

function BorrowingStatus({ status }) {
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

export default BorrowingActivityTable;

