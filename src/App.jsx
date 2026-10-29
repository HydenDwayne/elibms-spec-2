import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
// import BooksPage from "./pages/BookPages/BooksPage";
import PatronsPage from "./pages/PatronPages/PatronsPage";
import PatronDetails from "./pages/PatronPages/PatronDetails";
import RegisterPatronPage from "./pages/PatronPages/RegisterPatron";
import EditPatron from "./pages/PatronPages/EditPatron";
import ScanBookPage from "./pages/BookPages/ScanABook";
import BorrowBookPage from "./pages/BookPages/BorrowABook";
import BorrowBookTransaction from "./pages/BookPages/BorrowABookTransaction";
import ReturnBookTransaction from "./pages/BookPages/ReturnBookTransaction";
import ReturnBookPage from "./pages/BookPages/ReturnABook";
import RegisterBookPage from "./pages/BookPages/RegisterBook";
import BookDetails from "./pages/BookPages/BookDetails";
import EditBook from "./pages/BookPages/EditBook";
import ReportsPage from "./pages/UtilityPages/ReportsPage";
import SettingsPage from "./pages/UtilityPages/SettingsPage";
import BookReviews from "./pages/BookPages/BookReviews";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./layout/Layout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-slate-800 via-orange-900 to-orange-700 text-gray-200 min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute isAuthenticated={!!user} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/books" element={<DashboardPage />} />
          {/* <Route path="/books" element={<BooksPage />} /> */}
          <Route path="/patrons" element={<PatronsPage />} />
          <Route path="/scan" element={<ScanBookPage />} />
          <Route path="/borrow" element={<BorrowBookPage />} />
          <Route path="/return" element={<ReturnBookPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/books/register" element={<RegisterBookPage />} />
          <Route path="/patrons/register" element={<RegisterPatronPage />} />

          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="/books/:bookId/editing" element={<EditBook />} />
          <Route path="/books/:bookId/reviews" element={<BookReviews />} />

          <Route path="/patrons/:patronId" element={<PatronDetails />} />
          <Route path="/patrons/:patronId/editing" element={<EditPatron />} />

          <Route path="/borrow/txn" element={<BorrowBookTransaction />} />
          <Route path="/return/txn" element={<ReturnBookTransaction />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
