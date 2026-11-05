function FormSelect({ value, onChange, label, options, placeholder = "Select...", error = false }) {
  return (
    <div className="relative w-full">
      <p className={`mb-1 text-sm ${error ? "text-red-500" : "text-[#545F71]"}`}>{label}</p>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 w-full rounded-sm border bg-white px-2 text-xs text-[#53657a] outline-none transition-colors duration-200
          ${error ? "border-red-500 focus:border-red-500" : "border-[#545F71] focus:border-[#c96d45]"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;