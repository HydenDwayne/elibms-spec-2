import { useNavigate } from "react-router-dom";

function PatronTable({ patrons }) {
  const navigate = useNavigate();

  const handleRowClick = (patronId) => {
    navigate(`/patrons/${patronId}`);
  };

  return (
    <div className="w-full h-[520px] overflow-y-auto rounded-[2px] border border-[#eee7e3] bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="h-[35px] text-center border-b border-[#F6A85E]">
            <th className="w-[7%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              #
            </th>

            <th className="w-[18%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Name
            </th>

            <th className="w-[12%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              ID
            </th>

            <th className="w-[18%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Email
            </th>

            <th className="w-[17%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Contact No.
            </th>

            <th className="w-[12%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Violations
            </th>

            <th className="w-[16%] px-[12px] text-sm font-bold leading-none text-[#A35139]">
              Date Registered
            </th>
          </tr>
        </thead>

        <tbody>
          {patrons.map((patron, index) => (
            <tr
              key={patron.id}
              onClick={() => handleRowClick(patron.id)}
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
                {index + 1}
              </td>

              <td className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                {patron.name}
              </td>

              <td className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                {patron.idNumber}
              </td>

              <td className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                {patron.email}
              </td>

              <td className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139]">
                {patron.contactNo}
              </td>

              <td className="px-[12px] py-0">
                <ViolationBadge violations={patron.violations} />
              </td>

              {/* DATE REGISTERED */}
              <td className="truncate px-[12px] py-0 text-[10px] leading-none text-[#A35139] text-center">
                {patron.dateRegistered || "MM/DD/YYYY"}
              </td>
            </tr>
          ))}

          {patrons.length === 0 && (
            <tr>
              <td
                colSpan="7"
                className="h-[60px] text-center text-[10px] text-[#a8a8a8]"
              >
                No patrons found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ViolationBadge({ violations }) {
  if (!violations || violations === 0) {
    return (
      <span
        className="
            inline-flex
            h-[28px]
            min-w-[50px]
            items-center
            justify-center
            rounded-full
            bg-[#EEF1F4]
            px-[10px]
            text-[9px]
            font-normal
            leading-none
            text-[#A35139]
          "
      >
        None
      </span>
    );
  }

  return (
    <span
      className="
          inline-flex
          h-[28px]
          w-[28px]
          items-center
          justify-center
          rounded-full
          bg-[#FF4D00]
          text-[9px]
          font-normal
          leading-none
          text-[#FFFFFF]
        "
    >
      {violations}
    </span>
  );
}

export default PatronTable;
