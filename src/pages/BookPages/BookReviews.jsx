import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import coverFallback from "../../assets/book_default.jpg";
import StarRating from "../../components/StarRating";
import ReviewCard from "../../components/ReviewCard";
import RemoveReviewConfirmationModal from "../../components/RemoveReviewConfirmationModal";

import data from "../../data/dummy_data.json";

const gradientText =
  "bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent";

const MAX_COMMENT = 500;
const MIN_COMMENT = 10;

const SORTS = {
  newest: {
    label: "Newest",
    fn: (a, b) => b.date.localeCompare(a.date) || b.id - a.id,
  },
  oldest: {
    label: "Oldest",
    fn: (a, b) => a.date.localeCompare(b.date) || a.id - b.id,
  },
  highest: { label: "Highest rating", fn: (a, b) => b.rating - a.rating },
  lowest: { label: "Lowest rating", fn: (a, b) => a.rating - b.rating },
};

const fieldClass =
  "w-full rounded-sm border border-[#545F71] bg-white px-3 text-xs text-[#53657a] outline-none transition-colors duration-200 focus:border-[#c96d45]";

const BookReviews = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  // Placeholder data -- replace with the selected book / patrons / reviews from your backend.
  const book = data.books.find((b) => b.id === bookId);
  const patrons = data.patrons;
  const [reviews, setReviews] = useState(
    data.reviews.filter((r) => r.bookId === bookId),
  );

  // Form state
  const [patronId, setPatronId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  // List controls
  const [sortBy, setSortBy] = useState("newest");
  const [starFilter, setStarFilter] = useState("All");

  const [reviewToRemove, setReviewToRemove] = useState(null);

  const stats = useMemo(() => {
    const count = reviews.length;
    const average = count
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));
    return { count, average, distribution };
  }, [reviews]);

  const visibleReviews = useMemo(() => {
    return reviews
      .filter((r) => starFilter === "All" || r.rating === Number(starFilter))
      .sort(SORTS[sortBy].fn);
  }, [reviews, sortBy, starFilter]);

  const availablePatrons = patrons.filter(
    (p) => !reviews.some((r) => r.patronId === p.id),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!patronId) next.patron = "Select a patron.";
    if (!rating) next.rating = "Choose a rating.";
    if (comment.trim().length < MIN_COMMENT)
      next.comment = `Review must be at least ${MIN_COMMENT} characters.`;

    setErrors(next);
    if (Object.keys(next).length) return;

    const patron = patrons.find((p) => p.id === patronId);
    setReviews((prev) => [
      {
        id: Date.now(),
        patronId,
        patronName: patron.name,
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    resetForm();
  };

  const resetForm = () => {
    setPatronId("");
    setRating(0);
    setComment("");
    setErrors({});
  };

  const handleRemove = () => {
    if (!reviewToRemove) return;
    setReviews((prev) => prev.filter((r) => r.id !== reviewToRemove.id));
    setReviewToRemove(null);
  };

  return (
    <div className="h-full w-full overflow-y-auto px-15 pt-10 pb-10">
      <button
        className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#1D2937]"
        onClick={() => navigate(`/books/${bookId}`)}
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className={gradientText}>Back to Book Details</span>
      </button>

      <p className={`mb-5 text-2xl font-bold ${gradientText}`}>BOOK REVIEWS</p>

      {/* Selected book + rating summary */}
      <div className="grid grid-cols-2">
        <div className="flex flex-col items-center">
          <div className="flex h-90 w-88 shrink-0 justify-center">
            <img
              src={book.cover || coverFallback}
              alt={book.title}
              onError={(e) => {
                e.currentTarget.onerror = null; // prevents an infinite loop if the fallback fails too
                e.currentTarget.src = coverFallback;
              }}
            />
          </div>
          <div className="ml-4">
            <p className="text-lg font-bold">Book Title: {book.title}</p>
            <p className="mb-4 font-semibold">Author: {book.author}</p>
            <div className="text-sm">
              <p>ISBN: {book.isbn}</p>
              <p>Call Number: {book.callNumber}</p>
              <p>Publication Year: {book.publicationYear}</p>
              <p>Place of Publication: {book.placeOfPublication}</p>
              <p>Genre: {book.genre.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Form + list */}
        <div className="mt-1 mr-10 flex flex-col">
          <div className="flex flex-col pl-10 pb-10">
            <h2 className="mb-2 text-2xl font-medium text-[#53657a]">
              Ratings:
            </h2>
            <div className="flex items-center gap-6 border-t border-[#545F71] pt-3">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-semibold text-[#A35139]">
                  {stats.average.toFixed(1)}
                </p>
                <StarRating value={stats.average} size={13} />
                <p className="mt-1 text-[10px] text-[#545F71]">
                  {stats.count} review{stats.count === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex-1 space-y-1">
                {stats.distribution.map(({ star, count }) => (
                  <div
                    key={star}
                    className="flex items-center gap-2 text-[10px] text-[#545F71]"
                  >
                    <span className="w-3 text-right">{star}</span>
                    <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#e9edf0]">
                      <div
                        className="h-full rounded-full bg-[#F6A85E]"
                        style={{
                          width: stats.count
                            ? `${(count / stats.count) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="w-4">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Reviews list */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className={`text-lg font-bold ${gradientText}`}>
                Patron Reviews
              </p>
              <div className="flex gap-2">
                <select
                  value={starFilter}
                  onChange={(e) => setStarFilter(e.target.value)}
                  aria-label="Filter by rating"
                  className={`h-8 w-28 border-[#A35139] ${fieldClass}`}
                >
                  <option value="All">All ratings</option>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort reviews"
                  className={`h-8 w-32 border-[#A35139] ${fieldClass}`}
                >
                  {Object.entries(SORTS).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="violation-scrollbar max-h-[420px] overflow-y-auto">
              {visibleReviews.length === 0 ? (
                <div className="flex h-[40px] items-center border-t border-[#545F71]">
                  <span className="text-[12px] text-[#545F71]">
                    {reviews.length === 0
                      ? "No reviews yet. Be the first to review this book."
                      : "No reviews match this filter."}
                  </span>
                </div>
              ) : (
                visibleReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onRemove={setReviewToRemove}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <RemoveReviewConfirmationModal
        isOpen={Boolean(reviewToRemove)}
        onClose={() => setReviewToRemove(null)}
        onConfirm={handleRemove}
        patronName={reviewToRemove?.patronName}
      />
    </div>
  );
};

export default BookReviews;
