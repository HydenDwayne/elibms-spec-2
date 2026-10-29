// components/FormInput.jsx
function FormInput({ value, onChange, placeholder, label, length = "w-full", icon: Icon = null, editable = true }) {
  return (
    <div className="relative w-full">
      <p className="mb-1 text-sm text-[#545F71]">{label}</p>
      
      <div className="relative flex items-center">
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-9 ${length} rounded-sm border border-[#545F71] bg-white text-xs text-[#53657a] outline-none transition-colors duration-200 focus:border-[#c96d45]
            ${Icon ? "pr-9 pl-3" : "px-3"} 
          `}
          disabled={!editable}
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
