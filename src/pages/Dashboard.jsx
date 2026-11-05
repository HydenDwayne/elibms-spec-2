import React, { useState, useMemo } from "react";
import Widget from "../components/DashboardWidgets";
import Dropdown from "../components/QuickActionDropdown";
import { FiBook, FiUsers, FiBookmark, FiAlertCircle } from "react-icons/fi";
import { PiBooks } from "react-icons/pi";
import SearchField from "../components/SearchField";
import MainButton from "../components/MainButton";
import BookTable from "../components/BookTable";

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

// Which book fields each dropdown option searches
const fieldMap = {
  All: ["title", "author", "isbn", "genre"],
  Title: ["title"],
  Author: ["author"],
  ISBN: ["isbn"],
  Genre: ["genre"],
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredBooks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return books;

    const fields = fieldMap[selectedFilter] ?? fieldMap.All;

    return books.filter((b) =>
      fields.some((f) => String(b[f] ?? "").toLowerCase().includes(term))
    );
  }, [searchTerm, selectedFilter]);

  return (
    <div className="px-15 py-10 w-full">
      <div className="flex justify-between pr-4">
        <div>
          <p className="text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            DASHBOARD
          </p>
          <p className="text-lg text-gray-500">
            Welcome back, {data.users[0].displayName}!
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