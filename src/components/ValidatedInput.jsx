
const ValidatedInput = ({
  label,
  value,
  onChange,
  onBlur,
  error = "",
  placeholder = "",
  readOnly = false,
  maxLength,
  inputMode,
}) => {
  return (
    <div className="w-full mb-3">
      <label className="block text-xs text-[#1D2937]">{label}</label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        maxLength={maxLength}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        className={`mt-1 h-7 w-full rounded-sm border bg-white px-2 text-xs outline-none ${
          error
            ? "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-[#545F71] focus:border-[#53759D]"
        } ${readOnly ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
};

export default ValidatedInput;
