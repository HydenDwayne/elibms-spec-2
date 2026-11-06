// components/FormInput.jsx
function FormInput({ value, onChange, placeholder, label, length = "w-full", icon: Icon = null, editable = true, error = false,
  numbersOnly = false, maxLength, prefix = ""}) {  return (
    <div className="relative w-full">
      <p className={`mb-1 text-sm ${error ? "text-red-500" : "text-[#545F71]"}`}>{label}</p>
      
      <div className="relative flex items-center">
        
        {prefix && (
          <span className="pointer-events-none absolute left-3 text-xs text-[#53657a]">
            {prefix}
          </span>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => {
            let newValue = e.target.value;
            if (numbersOnly) {
              newValue = newValue.replace(/\D/g, "");
            }
            onChange(newValue);
          }}
          placeholder={placeholder}
          className={`h-9 ${length} rounded-sm border bg-white text-xs text-[#53657a] outline-none transition-colors duration-200
            ${error ? "border-red-500 focus:border-red-500" : "border-[#545F71] focus:border-[#c96d45]"}
            ${Icon ? "pr-9 pl-3" : "px-3"}`}          
          disabled={!editable}
          maxLength={maxLength}
          inputMode={numbersOnly ? "numeric" : "text"}
          style={prefix ? { paddingLeft: `calc(0.75rem + ${prefix.length + 1}ch)` } : undefined}
        />

        {Icon && (
          <div className="absolute right-3 text-gray-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

export default FormInput;
