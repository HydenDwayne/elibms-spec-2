import { ref, update, onValue, serverTimestamp } from "firebase/database";
import { db, auth } from "./firebase";

const bookRef = (bookId) => ref(db, `books/${bookId}`);

export const canArchiveBook = (book) =>
  book.status !== "Borrowed" && book.status !== "Overdue";

export const applyBookOverride = (book, override) => {
  if (!book || !override) return book;
  return {
    ...book,
    status: override.status ?? book.status,
    borrowable: override.borrowable ?? book.borrowable,
    previousStatus: override.previousStatus ?? null,
    previousBorrowable: override.previousBorrowable ?? null,
  };
};

export const archiveBook = (book) =>
  update(bookRef(book.id), {
    status: "Archived",
    borrowable: false,
    previousStatus: book.status ?? "Available",
    previousBorrowable: book.borrowable ?? true,
    archivedAt: serverTimestamp(),
    archivedBy: auth.currentUser?.uid ?? null,
  });

export const unarchiveBook = (book) =>
  update(bookRef(book.id), {
    status: book.previousStatus || "Available",
    borrowable: book.previousBorrowable ?? true,
    previousStatus: null,
    previousBorrowable: null,
    unarchivedAt: serverTimestamp(),
    unarchivedBy: auth.currentUser?.uid ?? null,
  });

export const setBookStatus = (book, status) =>
  update(bookRef(book.id), {
    status,
    borrowable:
      book.status === "Archived"
        ? (book.previousBorrowable ?? true)
        : (book.borrowable ?? true),
    previousStatus: null,
    previousBorrowable: null,
    statusChangedAt: serverTimestamp(),
    statusChangedBy: auth.currentUser?.uid ?? null,
  });

export const listenToBook = (bookId, callback) =>
  onValue(
    bookRef(bookId),
    (snap) => callback(snap.val()),
    (err) => console.error(err),
  );

export const listenToBookOverrides = (callback) =>
  onValue(
    ref(db, "books"),
    (snap) => callback(snap.val() ?? {}),
    (err) => console.error(err),
  );