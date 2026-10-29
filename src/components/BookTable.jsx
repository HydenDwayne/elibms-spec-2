import { useNavigate } from "react-router-dom";

function BookTable({ books }) {
  const navigate = useNavigate();

  const handleRowClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="w-full h-[300px] overflow-y-auto rounded-[2px] border border-[#eee7e3] bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="h-[35px] text-center border-b border-[#F6A85E]">
            <th className="w-[7%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Call No.
            </th>

            <th className="w-[24%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Title
            </th>

            <th className="w-[22%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Author
            </th>

            <th className="w-[14%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Genre
            </th>

            <th className="w-[18%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Status
            </th>

            <th className="w-[15%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Borrowable
            </th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr
              key={book.id}
              onClick={() => handleRowClick(book.id)}
              className="
                h-[35px]
                border-b border-[#F6A85E]
                cursor-pointer
                transition-colors
                hover:bg-[#faf3ef]
                text-center
              "
            >
              <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                {book.callNumber}
              </td>

              <td className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                {book.title}
              </td>

              <td className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                {book.author}
              </td>

              <td className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                {book.genre}
              </td>

              <td className="px-[12px] py-0">
                <StatusBadge status={book.status} />
              </td>

              <td className="px-[12px] py-0 text-[10px] leading-none text-[#A35139] text-center">
                {book.borrowable}
              </td>
            </tr>
          ))}

          {books.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="h-[60px] text-center text-[10px] text-[#a8a8a8]"
              >
                No books found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusStyles = {
    Borrowed: `bg-[#A35139] text-white border border-[#A35139]`,
    Returned: `bg-[#e9edf0] text-[#53657a] border border-[#e9edf0]`,
    Archived: `bg-white text-[#A35139] border border-[#A35139]`,
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

export default BookTable;
