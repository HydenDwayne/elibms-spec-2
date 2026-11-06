import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import BookAvailabilityStatus from "../../components/BookAvailabilityStatus";
import ArchiveBook from "../../components/ArchiveBook";
import ChangeBookStatus from "../../components/ChangeBookStatus";
import MainButton from "../../components/MainButton";
import SecondaryButton from "../../components/SecondaryButton";
import BorrowingHistoryTable from "../../components/BorrowingHistoryTable";
import BookStatus from "../../components/BookNFCStatus";
import coverFallback from "../../assets/book_default.jpg";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { GoDot, GoDotFill } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import StarRating from "../../components/StarRating";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";

import data from "../../data/dummy_data.json";
import {
  archiveBook,
  unarchiveBook,
  setBookStatus,
  canArchiveBook,
  listenToBooks,
} from "../../lib/bookActions";

const BookDetails = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const [dbBook, setDbBook] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [coverData, setCoverData] = useState("");
  
  useEffect(() => {
    const unsubscribe = onValue(ref(db, "books"), (snap) => {
      let found = null;
      if (snap.exists()) {
        Object.values(snap.val()).forEach((b) => {
          if (b && b.id === bookId) {
            found = b;
          }
        });
      }
      setDbBook(found);
      setLoaded(true);
    });
    return unsubscribe;
  }, [bookId]);

  const loading = !loaded;

  const [rtdbBooks, setRtdbBooks] = useState(null);
  const book =
    (rtdbBooks ?? []).find((b) => b.id === bookId) ??
    data.books.find((b) => b.id === bookId);
  const [pendingStatus, setPendingStatus] = useState(null);
  useEffect(() => {
    if (!book || !book.hasCover) return;
    const unsubscribe = onValue(ref(db, `bookCovers/${bookId}`), (snap) => {
      setCoverData(snap.exists() ? snap.val() : "");
    });
    return unsubscribe;
  }, [bookId, book]);


  useEffect(() => listenToBooks(setRtdbBooks), []);
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

  const handleArchiveConfirm = async (actionType) => {
    const isUnarchiving = actionType === "unarchive";

    if (!isUnarchiving && !canArchiveBook(book)) {
      toast.error("Cannot archive a book that is currently borrowed.");
      return;
    }

    try {
      if (isUnarchiving) {
        await unarchiveBook(book);
        toast.success("Book unarchived successfully.");
      } else {
        await archiveBook(book);
        toast.success("Book archived successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        isUnarchiving ? "Failed to unarchive book." : "Failed to archive book.",
      );
    }
  };

  const handleStatusRequest = (status) => {
    if (status !== book.status) setPendingStatus(status);
  };

  const handleStatusConfirm = async (status) => {
    try {
      await setBookStatus(book, status);
      toast.success(`Book status changed to ${status}.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to change book status.");
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
            status={book.status}
            onChange={handleStatusRequest}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className=" w-35 h-50 flex justify-center">
              <img
                src={coverData || book.cover || coverFallback}
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
                <p>Genre: {(book.genre ?? []).join(", ")}</p>
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
          <ChangeBookStatus
            isOpen={pendingStatus !== null}
            onClose={() => setPendingStatus(null)}
            onConfirm={handleStatusConfirm}
            bookTitle={book.title}
            currentStatus={book.status}
            newStatus={pendingStatus ?? ""}
          />
        </div>
        <div className="col-span-2 mt-5">
          <p>Recent Transactions</p>
          <BorrowingHistoryTable transactions={borrowingHistory} />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;