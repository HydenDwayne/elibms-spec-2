import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import PatronBorrowingHistoryTable from "../../components/PatronBorrowingHistoryTable";
import MainButton from "../../components/MainButton";
import SecondaryButton from "../../components/SecondaryButton";
// 1. Updated this import to match your new multi-state component name
import Violations from "../../components/Violation";
import ViolationModal from "../../components/ViolationModal";
import BookStatus from "../../components/BookNFCStatus";
import pfp from "../../assets/default.webp";
import { useState } from "react";
import { GoDot, GoDotFill } from "react-icons/go";
import ArchivePatron from "../../components/ArchivePatron";

import data from "../../data/dummy_data.json";

const PatronDetails = () => {
  const navigate = useNavigate();
  const { patronId } = useParams();
  const patron = data.patrons.find((p) => p.id === patronId);
  const patronName = patron.name;
  const transactions = data.transactions
    .filter((t) => t.patronId === patronId)
    .map((t) => ({
      ...t,
      returnedDate: t.returnedDate ?? "—",
      book: data.books.find((b) => b.id === t.bookId),
    }));
  const [violationsList, setViolationsList] = useState(
    data.violations.filter((v) => v.patronId === patronId),
  );

  // 3. Initialize modal visibility state
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);

  // 3. Handler functions to pass into your component
  const handleAddViolation = () => {
    setIsViolationModalOpen(true);
  };

  const handleViolationConfirm = (violation) => {
    const newViolation = {
      id: Date.now(),
      type: violation,
      description: "",
    };
    setViolationsList((prev) => [...prev, newViolation]);
  };

  const handleRemoveViolation = (id) => {
    setViolationsList(violationsList.filter((v) => v.id !== id));
  };

  const handleClick = () => {
    navigate("/patrons");
  };
  const handleArchiveConfirm = (actionType) => {
    navigate("/patrons");
  };

  return (
    <div className="px-15 pt-10 w-full">
      <button
        className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#1D2937]"
        onClick={handleClick}
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className="bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
          Back to Patrons
        </span>
      </button>

      <p className="mb-5 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        PATRON INFORMATION
      </p>

      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="w-50 h-50 rounded-full flex justify-center">
              <img src={pfp} alt="JJK" className="w-50 h-50 rounded-full" />
            </div>
            {/* <div className="ml-4">
              <p className="text-lg font-bold">Book Title: Jujutsu Kaisen</p>
              <p className="mb-4 font-semibold">Author: Gege Akutami</p>
              <div className="text-sm">
                <p>ISBN: M1231</p>
                <p>Call Number: B-1242</p>
                <p>Publication Year: 2018</p>
                <p>Place of Publication: Japan</p>
                <p>Genre: Action, Supernatural</p>
                <p>Borrowable: Yes</p>
              </div>
            </div> */}
            <div className="ml-4">
              <p className="text-xl font-bold mb-5">
                {patron.name}
              </p>
              <div className="text-sm">
                <p>Email: {patron.email}</p>
                <p>Contact No.: {patron.contactNo}</p>
                <p>Date Registered: {patron.dateRegistered}</p>
                <p>Violations: {violationsList.length}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-lg">Library Card Details:</p>
            <p className="text-sm">ID: {patron.id}</p>
          </div>
          <div className="w-65">
            <BookStatus value={patron.nfcStatus} icon={GoDotFill} />
          </div>
        </div>
        <div>
          <div className="flex flex-col items-start pl-10 w-full">
            {/* 5. Rendered the stateful component with its hooks */}
            <Violations
              violations={violationsList}
              onAdd={handleAddViolation}
              onRemove={handleRemoveViolation}
            />
          </div>
        </div>
        <div className="flex flex-row justify-between col-span-2 pt-5">
          <SecondaryButton
            text={"Edit Patron"}
            to={"edit-patron"}
            id={patronId}
          />

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
            {"Archive Patron"}
          </button>
        </div>
        <div className="col-span-2 mt-5">
          <p>Recent Transactions</p>
          <PatronBorrowingHistoryTable transactions={transactions} />
        </div>
      </div>

      <ArchivePatron
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={handleArchiveConfirm}
        patronName={patronName}
        action="suspend"
      />
      <ViolationModal
        isOpen={isViolationModalOpen}
        onClose={() => setIsViolationModalOpen(false)}
        onConfirm={handleViolationConfirm}
      />
    </div>
  );
};

export default PatronDetails;
