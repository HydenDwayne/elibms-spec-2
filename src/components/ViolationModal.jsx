import { useState } from "react";

function ViolationModal({ isOpen, onClose, onConfirm }) {
  const [violation, setViolation] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!violation) {
      setError("Please choose the appropriate violation");
      return;
    }

    setError("");
    onConfirm(violation);
    setViolation("");
    onClose();
  };

  const handleClose = () => {
    setViolation("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5">
      <div className="relative h-[295px] w-[520px] rounded-[10px] border-[2px] border-[#53657a] bg-[#fdfdfd]">

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[13px] top-[10px] text-[30px] leading-none text-[#53657a] transition-opacity hover:opacity-60"
        >
          ×
        </button>

        <h2 className="absolute left-[68px] top-[35px] bg-gradient-to-r from-[#1c3147] to-[#4d739b] bg-clip-text text-[26px] font-bold leading-none text-transparent">
          Add Violation
        </h2>

        <div className="absolute left-1/2 top-[100px] w-[250px] -translate-x-1/2">

          <label className="mb-[6px] block text-[12px] font-semibold text-[#53657a]">
            Choose Violation
          </label>

          <select
            value={violation}
            onChange={(e) => {
              setViolation(e.target.value);
              setError("");
            }}
            className="h-[35px] w-full appearance-auto rounded-[4px] border border-[#53657a] bg-white px-[9px] text-[11px] text-[#53657a] outline-none focus:border-[#4d739b]">
            <option value="">Overdue return of book</option>
            <option value="Overdue return of book">Overdue return of book</option>
            <option value="Lost book">Lost book</option>
            <option value="Damaged book">Damaged book</option>
            <option value="Unauthorized borrowing">Unauthorized borrowing</option>
          </select>

          <p
            className={`mt-[4px] pl-[9px] text-[8px] ${
              error ? "text-red-500" : "text-[#8c8c8c]"
            }`}
          >
            {error || "*Please choose the appropriate violation"}
          </p>

          <button
            type="button"
            onClick={handleConfirm}
            className="mt-[52px]
                h-[40px]
                w-[250px]
                items-center
                justify-center
                gap-1
                rounded-[4px]
                bg-gradient-to-r
                from-[#1D2937]
                to-[#53759D]
                text-[10px]
                font-medium
                text-white
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:shadow-md
                active:translate-y-0">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViolationModal;