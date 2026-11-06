import { useState, useMemo } from "react";
import SearchField from "../../components/SearchField";
import MainButton from "../../components/MainButton";
import PatronTable from "../../components/PatronTable";
import { Helmet } from "react-helmet-async";

import data from "../../data/dummy_data.json";
import { listenToPatrons } from "../../lib/patronActions";

const patrons = data.patrons.map((p) => ({
  ...p,
  idNumber: p.id,
  violations: data.violations.filter((v) => v.patronId === p.id).length,
}));

const PATRON_FILTERS = ["All", "Name", "ID", "Contact No.", "Email"];

const fieldGetters = {
  Name: (p) => [p.name, `${p.firstName} ${p.middleName} ${p.lastName}`, `${p.firstName} ${p.lastName}`],
  ID: (p) => [p.id],
  "Contact No.": (p) => [p.contactNo],
  Email: (p) => [p.email],
};
fieldGetters.All = (p) => [
  ...fieldGetters.Name(p),
  ...fieldGetters.ID(p),
  ...fieldGetters["Contact No."](p),
  ...fieldGetters.Email(p),
];

const PatronsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredPatrons = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return patrons;

    const getFields = fieldGetters[selectedFilter] ?? fieldGetters.All;

    return patrons.filter((p) =>
      getFields(p).some((v) => String(v ?? "").toLowerCase().includes(term))
    );
  }, [searchTerm, selectedFilter]);

  return (
    <div className="px-15 py-10 w-full">
      <Helmet>
        <title>ELIBMS | Patrons</title>
      </Helmet>
      <p className="mb-5 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        PATRONS PAGE
      </p>

      <div className="flex justify-between pr-4">
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          filter={selectedFilter}
          onFilterChange={setSelectedFilter}
          placeholder={
            selectedFilter === "All"
              ? "Search name, ID"
              : `Search by ${selectedFilter}`
          }
          filterOptions={PATRON_FILTERS}
        />

        <MainButton text={"Register Patron"} to={"register-patron"} />
      </div>

      <div className="mt-10">
        {filteredPatrons.length > 0 ? (
          <PatronTable patrons={filteredPatrons} />
        ) : (
          <p className="py-10 text-center text-gray-500">No patrons found.</p>
        )}
      </div>
    </div>
  );
};

export default PatronsPage;