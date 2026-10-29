// components/FormInput.jsx
function BookStatus({ value, icon: Icon = null }) {
  return (
    <div className="relative w-full">
      <p className="mb-1 text-sm text-[#545F71]">Status</p>
      
      <div className="relative flex items-center">
        
        <input
          type="text"
          value={value}
          className={`text-[#AA563F] h-9 w-full rounded-sm border border-[#FF4D00] bg-white text-xs text-[#53657a] outline-none transition-colors duration-200 focus:border-[#c96d45]
            ${Icon ? "pl-9 pr-3" : "px-3"} 
          `}
          disabled
        />

        {Icon && (
          <div className="absolute left-3 text-gray-400 pointer-events-none">
            <Icon size={16} color="#FF5733"/>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookStatus;
