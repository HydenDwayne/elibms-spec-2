import StarRating from "./StarRating";

const formatDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function ReviewCard({ review, onRemove }) {
  return (
    <div className="border-t border-[#545F71] px-2 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#1D2937]">
            {review.patronName}
          </p>
          <p className="text-[10px] text-[#545F71]">
            {formatDate(review.date)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <StarRating value={review.rating} size={12} />
          <button
            type="button"
            onClick={() => onRemove(review)}
            aria-label={`Remove review by ${review.patronName}`}
            className="text-[15px] leading-none text-[#545F71] transition-colors hover:text-[#A35139]">
            ×
          </button>
        </div>
      </div>

      <p className="mt-2 whitespace-pre-line break-words text-xs leading-relaxed text-[#53657a]">
        {review.comment}
      </p>
    </div>
  );
}

export default ReviewCard;
