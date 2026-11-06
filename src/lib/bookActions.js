import { ref, update, onValue, serverTimestamp } from "firebase/database";
import { db, auth } from "./firebase";

export const canArchiveBook = (book) =>
  book.status !== "Borrowed" && book.status !== "Overdue";

const updateBook = (book, fields) => {
  if (book.key === undefined || book.key === null) {
    return Promise.reject(new Error("Book was not found in the database."));
  }
  return update(ref(db, `books/${book.key}`), fields);
};

export const updateBookCover = (book, coverUrl) =>
  updateBook(book, {
    coverUrl,
    coverUpdatedAt: serverTimestamp(),
    coverUpdatedBy: auth.currentUser?.uid ?? null,
  });

export const archiveBook = (book) =>
  updateBook(book, {
    status: "Archived",
    borrowable: false,
    previousStatus: book.status ?? "Available",
    previousBorrowable: book.borrowable ?? true,
    archivedAt: serverTimestamp(),
    archivedBy: auth.currentUser?.uid ?? null,
  });

export const unarchiveBook = (book) =>
  updateBook(book, {
    status: book.previousStatus || "Available",
    borrowable: book.previousBorrowable ?? true,
    previousStatus: null,
    previousBorrowable: null,
    unarchivedAt: serverTimestamp(),
    unarchivedBy: auth.currentUser?.uid ?? null,
  });

export const setBookStatus = (book, status) =>
  updateBook(book, {
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

export const listenToBooks = (callback) =>
  onValue(
    ref(db, "books"),
    (snap) => {
      const books = Object.entries(snap.val() ?? {})
        .filter(([, book]) => book && book.id && book.title)
        .map(([key, book]) => ({ ...book, key }));
      callback(books);
    },
    (err) => console.error(err),
  );