import React from "react";
import Widget from "../components/DashboardWidgets";
import TransactionTable from "../components/TransactionTable";
import Dropdown from "../components/QuickActionDropdown";
import { FiBook, FiUsers, FiBookmark, FiAlertCircle } from "react-icons/fi";
import { PiBooks } from "react-icons/pi";
import SearchField from "../components/SearchField";
import MainButton from "../components/MainButton";
import BookTable from "../components/BookTable";
import { useState } from "react";

import data from "../data/dummy_data.json";

const Dashbboard = () => {
const iconMap = {
  FiBook: <FiBook className="text-xl" />,
  PiBooks: <PiBooks className="text-xl" />,
  FiBookmark: <FiBookmark className="text-xl text-white" />,
  FiAlertCircle: <FiAlertCircle className="text-xl" />,
  FiUsers: <FiUsers className="text-xl" />,
};
const widgetData = data.dashboard.widgets.map((w) => ({ ...w, icon: iconMap[w.icon] }));

const books = data.books.map((b) => ({
  ...b,
  genre: b.genre.join(", "),
  borrowable: b.borrowable ? "Yes" : "No",
}));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  return (
    <div className="px-15 py-10 w-full">
      <div className="flex justify-between pr-4">
        <div>
          <p className="text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            DASHBOARD
          </p>
          <p className="text-lg text-gray-500">Welcome back, {data.users[0].displayName}!</p>
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
            placeholder="Search title, author, ISBN, ..."
            isBooks={true}
          />

          <MainButton text={"Register Book"} to={"register-book"} />
        </div>

        <div className="mt-10 w-full">
          <BookTable books={books} />
        </div>
      </div>
    </div>
  );
};

export default Dashbboard;
