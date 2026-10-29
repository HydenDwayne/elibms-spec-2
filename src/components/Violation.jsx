import { useState } from "react";
import RemoveViolationConfirmationModal from "./RemoveViolationConfirmationModal";

function Violations({ violations, onAdd, onRemove }) {
  const [violationToRemove, setViolationToRemove] = useState(null);

  const handleConfirmRemove = () => {
    if (!violationToRemove) return;

    onRemove(violationToRemove.id);
    setViolationToRemove(null);
  };

  const violationName =
    violationToRemove?.type ||
    violationToRemove?.description ||
    "Violation";

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium text-[#53657a]">
            Violations:
          </h2>

          <button
            type="button"
            onClick={onAdd}
            aria-label="Add violation"
            className="flex h-[20px] w-[20px] items-center justify-center text-xl text-[#545F71] transition-colors hover:text-[#A35139]">
            +
          </button>
        </div>

        <div className="violation-scrollbar mt-2 max-h-[120px] overflow-y-auto">
          {violations.length === 0 ? (
            <div className="flex h-[21px] items-center border-t border-[#545F71]">
              <span className="text-[12px] text-[#545F71]">
                No violations
              </span>
            </div>
          ) : (
            violations.map((violation, index) => (
              <div
                key={violation.id ?? index}
                className="flex min-h-[32px] items-center justify-between border-t border-[#545F71] px-2 py-1">
                <span className="min-w-0 flex-1 truncate pr-3 text-[12px] text-[#545F71]">
                  {violation.type ||
                    violation.description ||
                    "Violation"}
                </span>

                <button
                  type="button"
                  onClick={() => setViolationToRemove(violation)}
                  aria-label={`Remove ${
                    violation.type ||
                    violation.description ||
                    "violation"
                  }`}
                  className="shrink-0 text-[15px] leading-none text-[#545F71] transition-colors hover:text-[#A35139]">
                     ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <RemoveViolationConfirmationModal
        isOpen={Boolean(violationToRemove)}
        onClose={() => setViolationToRemove(null)}
        onConfirm={handleConfirmRemove}
        violationName={violationName}
      />
    </>
  );
}

export default Violations;

// add mo 2 ulit sa index.css

// .violation-scrollbar::-webkit-scrollbar {
//   width: 5px;
// }

// .violation-scrollbar::-webkit-scrollbar-track {
//   background: #f5f1ef;
// }

// .violation-scrollbar::-webkit-scrollbar-thumb {
//   background: #F6A85E;
//   border-radius: 10px;
// }

// .violation-scrollbar::-webkit-scrollbar-thumb:hover {
//   background: #A35139;
// }

