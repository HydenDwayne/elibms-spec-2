function ArchiveBook({
  isOpen,
  onClose,
  onConfirm,
  patronName = "",
  action = "archive",
}) {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(action);
    onClose();
  };

  const isUnsuspending = action === "archived";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        className="relative h-[295px] w-[520px] max-w-full rounded-[10px] border border-[#53657A] bg-[#FDFDFD]"
        onClick={(e) => e.stopPropagation()}>
        
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-[13px] top-[10px] text-[30px] leading-none text-[#53657A] transition-opacity hover:opacity-60">
          ×
        </button>

        <h2
          id="confirmation-title"
          className="absolute left-[9%] top-[35px] bg-gradient-to-r from-[#1C3147] to-[#4D739B] bg-clip-text text-[26px] font-bold leading-none text-transparent">
          {isUnsuspending ? "Unarchive Book" : "Archive Book"}
        </h2>

        <div className="absolute left-1/2 top-[105px] w-[330px] max-w-[82%] -translate-x-1/2">
          <p className="text-center text-[14px] leading-relaxed text-[#53657A]">
            Are you sure you want to {action}{" "}
            <span className="bg-gradient-to-r from-[#1C3147] to-[#4D739B] bg-clip-text font-semibold text-transparent">
              {patronName}
            </span>
            ?
          </p>

          <div className="mt-[45px] flex w-full gap-[12px]">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-[40px] flex-1 items-center justify-center rounded-[4px] border border-[#53657A] bg-white text-[12px] font-medium text-[#53657A] transition-all duration-200 hover:bg-gray-100">
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex h-[40px] flex-1 items-center justify-center rounded-[4px] bg-gradient-to-r from-[#1D2937] to-[#53759D] text-[12px] font-medium text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchiveBook;





