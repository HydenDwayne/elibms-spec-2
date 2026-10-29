import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa6";

// Read-only when `onChange` is not provided, interactive otherwise.
function StarRating({ value = 0, onChange, size = 14 }) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const shown = interactive && hover ? hover : value;

  return (
    <div
      className="flex items-center gap-[2px]"
      role={interactive ? "radiogroup" : "img"}
      aria-label={`${value} out of 5 stars`}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const Icon = n <= Math.round(shown) ? FaStar : FaRegStar;
        const icon = <Icon size={size} className="text-[#F6A85E]" />;

        return interactive ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            className="transition-transform hover:scale-110"
          >
            {icon}
          </button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </div>
  );
}

export default StarRating;
