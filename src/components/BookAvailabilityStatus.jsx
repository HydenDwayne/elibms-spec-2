import React, { useState, useEffect, useRef } from "react";
import { 
  FiChevronDown, 
  FiMaximize, 
  FiArrowUpRight, 
  FiArrowDownLeft 
} from "react-icons/fi";

export default function BookAvailabilityStatus({ status = "Available", onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Add state to hold the currently selected status text label
  const [selectedStatus, setSelectedStatus] = useState(status);
  
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Accept the visible label text to update the button interface frame
  const handleAction = (actionType, labelText) => {
    setIsOpen(false);
    setSelectedStatus(labelText); // Set the button text to the chosen option
    console.log(`Triggered action: ${actionType}`);
    if (onChange) onChange(labelText);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Selection Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex 
          h-9 
          w-74 
          items-center 
          justify-between 
          rounded-md 
          border 
          border-[#AA563F] 
          bg-stone-50 
          px-4 
          text-xs 
          font-medium 
          text-orange-800 
          shadow-sm 
          transition-all 
          hover:bg-orange-50 
          focus:outline-none"
      >
        {/* 3. Display the selected item text state */}
        <span>{selectedStatus}</span>
        <FiChevronDown 
          className={`text-sm transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Floating Action Menu Panel */}
      {isOpen && (
        <div
          className="
            absolute 
            right-0 
            z-50 
            mt-2 
            w-74
            origin-top-right 
            rounded-lg 
            border 
            border-[#AA563F] 
            bg-white 
            p-1 
            shadow-md"
        >
          <button
            onClick={() => handleAction("Available", "Available")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-800"
          >
            <FiMaximize className="text-sm shrink-0 text-orange-800" />
            <span>Available</span>
          </button>

          <button
            onClick={() => handleAction("borrowed", "Borrowed")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-800"
          >
            <FiArrowUpRight className="text-sm shrink-0 text-orange-800" />
            <span>Borrowed</span>
          </button>

          <button
            onClick={() => handleAction("overdue", "Overdue")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-800"
          >
            <FiArrowDownLeft className="text-sm shrink-0 text-orange-800" />
            <span>Overdue</span>
          </button>
          
          <button
            onClick={() => handleAction("restoration", "Under Restoration")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-800"
          >
            <FiArrowDownLeft className="text-sm shrink-0 text-orange-800" />
            <span>Under Restoration</span>
          </button>

        </div>
      )}
    </div>
  );
}