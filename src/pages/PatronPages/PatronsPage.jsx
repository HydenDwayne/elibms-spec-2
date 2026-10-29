import SearchField from "../../components/SearchField";
import MainButton from "../../components/MainButton";
import PatronTable from "../../components/PatronTable";
import { useState } from "react";

import data from "../../data/dummy_data.json";

const PatronsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const patrons = data.patrons.map((p) => ({
  ...p,
  idNumber: p.id,
  violations: data.violations.filter((v) => v.patronId === p.id).length,
}));
  return (
    <div className="px-15 py-10 w-full">
      <p className="mb-5 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        PATRONS PAGE
      </p>

      <div className="flex justify-between pr-4">
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          filter={selectedFilter}
          onFilterChange={setSelectedFilter}
          placeholder="Search name, ID"
          isBooks={false}
        />

        <MainButton text={"Register Patron"}  to={"register-patron"}/>
      </div>

      <div className="mt-10">
        <PatronTable patrons={patrons} />
      </div>
    </div>
  );
};

export default PatronsPage;
