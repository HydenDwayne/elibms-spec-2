import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiChevronDown, 
  FiMaximize, 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiPlusCircle 
} from "react-icons/fi";

export default function QuickActionDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
    const navigate = useNavigate();

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

  const handleAction = (actionType) => {
    setIsOpen(false);
    switch (actionType) {
      case "scan":
        navigate("/scan");
        break;
      case "borrow":
        navigate("/borrow");
        break;
      case "return":
        navigate("return");
        break;
      case "add-book":
        navigate("/books/register");
        break;
    
      default:
        navigate("/");
    }
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
        <span>Quick Actions</span>
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
            onClick={() => handleAction("scan")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-800"
          >
            <FiMaximize className="text-sm shrink-0 text-orange-800" />
            <span>Scan a Book</span>
          </button>

          <button
            onClick={() => handleAction("borrow")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-800"
          >
            <FiArrowUpRight className="text-sm shrink-0 text-orange-800" />
            <span>Borrow a Book</span>
          </button>

          <button
            onClick={() => handleAction("return")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-800"
          >
            <FiArrowDownLeft className="text-sm shrink-0 text-orange-800" />
            <span>Return a Book</span>
          </button>

          {/* Clean separation divider */}
          <div className="my-1 border-t border-orange-50" />

          <button
            onClick={() => handleAction("add-book")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-orange-50 hover:text-orange-800"
          >
            <FiPlusCircle className="text-sm shrink-0 text-orange-800" />
            <span>Add New Book Entry</span>
          </button>
        </div>
      )}
    </div>
  );
}
