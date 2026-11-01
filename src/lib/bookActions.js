const BOOK_KEY = "elibms.bookOverrides";

const readOverrides = () => {
  try {
    return JSON.parse(localStorage.getItem(BOOK_KEY)) || {};
  } catch {
    return {};
  }
};

const saveOverride = (id, fields) => {
  const all = readOverrides();
  all[id] = { ...(all[id] || {}), ...fields };
  try {
    localStorage.setItem(BOOK_KEY, JSON.stringify(all));
  } catch {
    return;
  }
};

export const applyBookOverride = (book) => {
  if (!book) return book;
  return { ...book, ...(readOverrides()[book.id] || {}) };
};

export const archiveBook = (book) => {
  if (book.status === "Archived") {
    return { ok: false, message: "Book is already archived." };
  }
  if (book.status === "Borrowed" || book.status === "Overdue") {
    return {
      ok: false,
      message: "Cannot archive a book that is currently borrowed.",
    };
  }
  saveOverride(book.id, {
    status: "Archived",
    previousStatus: book.status,
    borrowable: false,
    previousBorrowable: book.borrowable,
  });
  return { ok: true, message: "Book archived." };
};

export const unarchiveBook = (book) => {
  if (book.status !== "Archived") {
    return { ok: false, message: "Book is not archived." };
  }
  saveOverride(book.id, {
    status: book.previousStatus || "Available",
    borrowable: book.previousBorrowable ?? true,
    previousStatus: null,
    previousBorrowable: null,
  });
  return { ok: true, message: "Book restored." };
};

export const setBookStatus = (book, status) => {
  if (book.status === status) {
    return { ok: false, message: "Status is already " + status + "." };
  }
  const wasArchived = book.status === "Archived";
  saveOverride(book.id, {
    status,
    borrowable: wasArchived ? (book.previousBorrowable ?? true) : book.borrowable,
    previousStatus: null,
    previousBorrowable: null,
  });
  return { ok: true, message: "Status changed to " + status + "." };
};