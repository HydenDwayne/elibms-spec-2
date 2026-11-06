import React, { useState, useMemo } from "react";
import Widget from "../components/DashboardWidgets";
import Dropdown from "../components/QuickActionDropdown";
import { FiBook, FiUsers, FiBookmark, FiAlertCircle, FiChevronDown } from "react-icons/fi";
import { PiBooks } from "react-icons/pi";
import SearchField from "../components/SearchField";
import MainButton from "../components/MainButton";
import BookTable from "../components/BookTable";
import { useLibrarian } from "../components/LibrarianContext";

import data from "../data/dummy_data.json";

const iconMap = {
  FiBook: <FiBook className="text-xl" />,
  PiBooks: <PiBooks className="text-xl" />,
  FiBookmark: <FiBookmark className="text-xl text-white" />,
  FiAlertCircle: <FiAlertCircle className="text-xl" />,
  FiUsers: <FiUsers className="text-xl" />,
};

const widgetData = data.dashboard.widgets.map((w) => ({
  ...w,
  icon: iconMap[w.icon],
}));

const books = data.books.map((b) => ({
  ...b,
  genre: b.genre.join(", "),
  borrowable: b.borrowable ? "Yes" : "No",
}));

const fieldMap = {
  All: ["title", "author", "isbn", "genre"],
  Title: ["title"],
  Author: ["author"],
  ISBN: ["isbn"],
  Genre: ["genre"],
};

const STATUS_OPTIONS = ["Available", "Borrowed", "Overdue", "Archived"];

const Dashboard = () => {
  const { librarian } = useLibrarian();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBooks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const fields = fieldMap[selectedFilter] ?? fieldMap.All;

    return books.filter((b) => {
      const matchesSearch =
        !term ||
        fields.some((f) => String(b[f] ?? "").toLowerCase().includes(term));

      const matchesStatus = statusFilter === "All" || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedFilter, statusFilter]);

  return (
    <div className="px-15 py-10 w-full">
      <div className="flex justify-between pr-4">
        <div>
          <p className="text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            DASHBOARD
          </p>
          <p className="text-lg text-gray-500">
            Welcome back, {librarian?.displayName}!
          </p>
        </div>
        <Dropdown />
      </div>

      <div className="flex flex-wrap gap-6 mt-10">
        {widgetData.map((widget, index) => (
          <Widget
            key={index}
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
          />
        ))}
      </div>

      <div className="mt-10">
        <p className="mb-5 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
          MATERIALS
        </p>

        <div className="flex justify-between pr-4">
          <div className="flex items-center gap-3">
            <SearchField
              value={searchTerm}
              onChange={setSearchTerm}
              filter={selectedFilter}
              onFilterChange={setSelectedFilter}
              placeholder={
                selectedFilter === "All"
                  ? "Search title, author, ISBN, ..."
                  : `Search by ${selectedFilter}`
              }
              isBooks={true}
            />

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="h-9 w-40 cursor-pointer appearance-none rounded-sm border border-[#A35139] bg-white pl-3 pr-8 text-xs text-[#53657a] outline-none transition-colors duration-200 focus:border-[#c96d45]"
              >
                <option value="All">All Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#A35139]" />
            </div>
          </div>

          <MainButton text={"Register Book"} to={"register-book"} />
        </div>

        <div className="mt-10 w-full">
          {filteredBooks.length > 0 ? (
            <BookTable books={filteredBooks} />
          ) : (
            <p className="py-10 text-center text-gray-500">No books found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;