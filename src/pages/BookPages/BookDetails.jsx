import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import BookAvailabilityStatus from "../../components/BookAvailabilityStatus";
import ArchiveBook from "../../components/ArchiveBook";
import MainButton from "../../components/MainButton";
import SecondaryButton from "../../components/SecondaryButton";
import BorrowingHistoryTable from "../../components/BorrowingHistoryTable";
import BookStatus from "../../components/BookNFCStatus";
import coverFallback from "../../assets/book_default.jpg";
import { useState } from "react";
import { GoDot, GoDotFill } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import StarRating from "../../components/StarRating";

import data from "../../data/dummy_data.json";
import {
  applyBookOverride,
  archiveBook,
  unarchiveBook,
  setBookStatus,
} from "../../lib/bookActions";

const BookDetails = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const [book, setBook] = useState(() =>
    applyBookOverride(data.books.find((b) => b.id === bookId)),
  );
  const [notice, setNotice] = useState("");
  const borrowingHistory = data.transactions
    .filter((t) => t.bookId === bookId)
    .map((t) => ({
      ...t,
      returnedDate: t.returnedDate ?? "—",
      patron: data.patrons.find((p) => p.id === t.patronId),
    }));
  const reviews = data.reviews.filter((r) => r.bookId === bookId);
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleClick = () => {
    navigate("/");
  };
  const handleReviewsClick = () => {
    navigate(`/books/${bookId}/reviews`);
  };

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const isArchived = book.status === "Archived";

  const handleArchiveConfirm = (actionType) => {
    const result =
      actionType === "unarchive" ? unarchiveBook(book) : archiveBook(book);
    setNotice(result.message);
    if (result.ok) {
      setBook(applyBookOverride(data.books.find((b) => b.id === bookId)));
    }
  };

  const handleStatusChange = (status) => {
    const result = setBookStatus(book, status);
    setNotice(result.message);
    if (result.ok) {
      setBook(applyBookOverride(data.books.find((b) => b.id === bookId)));
    }
  };

  return (
    <div className="px-15 pt-10 w-full">
      <button
        className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#1D2937]"
        onClick={handleClick}
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className="bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
          Back to Dashboard
        </span>
      </button>

      <div className="flex flex-row justify-between mb-2">
        <p className="mb-5 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
          BOOK DETAILS
        </p>
        <div className="pr-10">
          <p>Availability Status</p>
          <BookAvailabilityStatus
            key={book.status}
            status={book.status}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className=" w-35 h-50 flex justify-center">
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
              {isArchived && (
                <span className="mb-2 inline-block rounded-full border border-[#A35139] px-3 py-0.5 text-xs text-[#A35139]">
                  Archived
                </span>
              )}
              <p className="mb-4 font-semibold">Author: {book.author}</p>
              <div className="text-sm">
                <p>ISBN: {book.isbn}</p>
                <p>Call Number: {book.callNumber}</p>
                <p>Publication Year: {book.publicationYear}</p>
                <p>Place of Publication: {book.placeOfPublication}</p>
                <p>Genre: {book.genre.join(", ")}</p>
                <p>Borrowable: {book.borrowable ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs">Tag ID: {book.tagId}</p>
          </div>
          <div className="w-65">
            <BookStatus value={book.nfcStatus} icon={GoDotFill} />
          </div>
        </div>
        <div>
          <div className="flex flex-col items-end"></div>
          <div className="pt-3 pr-10">
            <div className="flex flex-row gap-1">
              <p className="text-xl font-semibold pr-4">Synopsis</p>
              <StarRating value={avg} size={25} />
              <p>
                {reviews.length}{" "}
                <button
                  className="text-xs text-blue-500 underline cursor-pointer"
                  onClick={handleReviewsClick}
                >
                  View reviews
                </button>
              </p>
            </div>
            <p className="text-sm text-justify">{book.synopsis}</p>
          </div>
        </div>
        <div className="flex flex-row justify-between col-span-2 pt-5">
          <SecondaryButton text={"Edit Book"} to={"edit-book"} id={bookId} />
          {/* <MainButton text={"Archive Book"} to={"archive-book"} /> */}
          <button
            onClick={() => setIsArchiveModalOpen(true)}
            className="flex
        h-9
        w-65
        items-center
        justify-center
        gap-1
        rounded-sm
        bg-gradient-to-r
        from-[#1D2937]
        to-[#53759D]
        text-sm
        font-semibold
        text-white
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:shadow-md
        active:translate-y-0"
          >
            {isArchived ? "Unarchive Book" : "Archive Book"}
          </button>
          <ArchiveBook
            isOpen={isArchiveModalOpen}
            onClose={() => setIsArchiveModalOpen(false)}
            onConfirm={handleArchiveConfirm}
            bookTitle={book.title}
            action={isArchived ? "unarchive" : "archive"}
          />
        </div>
        {notice && (
          <p className="col-span-2 pt-3 text-sm text-[#53657A]">{notice}</p>
        )}
        <div className="col-span-2 mt-5">
          <p>Recent Transactions</p>
          <BorrowingHistoryTable transactions={borrowingHistory} />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;