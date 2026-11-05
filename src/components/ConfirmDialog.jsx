const ConfirmDialog = ({
  isOpen,
  variant = "warning",
  title,
  message,
  details = [],
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;
  const isError = variant === "error";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-[420px] rounded-md bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className={`mb-2 text-lg font-bold ${
            isError ? "text-red-600" : "text-[#1D2937]"
          }`}
        >
          {isError ? "⚠ " : ""}
          {title}
        </p>
        <p className="text-sm text-[#1D2937]">{message}</p>

        {details.length > 0 && (
          <ul className="mt-3 list-disc pl-5 text-xs text-red-500">
            {details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end gap-3">
          {!isError && (
            <button
              onClick={onClose}
              className="h-9 w-28 rounded-sm border border-[#1D2937] bg-white text-sm font-semibold text-[#1D2937]"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={isError ? onClose : onConfirm}
            className="h-9 w-28 rounded-sm bg-gradient-to-r from-[#1D2937] to-[#53759D] text-sm font-semibold text-white"
          >
            {isError ? "OK" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
