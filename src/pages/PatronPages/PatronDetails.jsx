import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import PatronBorrowingHistoryTable from "../../components/PatronBorrowingHistoryTable";
import MainButton from "../../components/MainButton";
import SecondaryButton from "../../components/SecondaryButton";
import Violations from "../../components/Violation";
import ViolationModal from "../../components/ViolationModal";
import BookStatus from "../../components/BookNFCStatus";
import pfp from "../../assets/default.webp";
import { GoDot, GoDotFill } from "react-icons/go";
import ArchivePatron from "../../components/ArchivePatron";
import { useState, useEffect } from "react";
import { ref, push, set, remove, onValue, query, orderByChild, equalTo, runTransaction } from "firebase/database";
import { db, auth } from "../../lib/firebase";
import toast from "react-hot-toast";
import {
  suspendPatron,
  liftSuspension,
  listenToPatronStatus,
} from "../../lib/patronActions";

import data from "../../data/dummy_data.json";

const PatronDetails = () => {
  const navigate = useNavigate();
  const { patronId } = useParams();
  const patron = data.patrons.find((p) => p.id === patronId);
  const patronName = patron.name;
  const [status, setStatus] = useState(patron.status);
  const isSuspended = status === "Suspended";

  useEffect(() => {
    return listenToPatronStatus(patronId, (value) =>
      setStatus(value ?? patron.status),
    );
  }, [patronId, patron.status]);
  const transactions = data.transactions
    .filter((t) => t.patronId === patronId)
    .map((t) => ({
      ...t,
      returnedDate: t.returnedDate ?? "—",
      book: data.books.find((b) => b.id === t.bookId),
    }));
  const [violationsList, setViolationsList] = useState([]);

  useEffect(() => {
    const q = query(ref(db, "violations"), orderByChild("patronId"), equalTo(patronId));
    const unsubscribe = onValue(q, (snap) => {
      const val = snap.val() ?? {};
      setViolationsList(
        Object.entries(val)
        .map(([key, v]) => ({ ...v, id: v.id ?? key, key }))
        .filter((v) => v.status !== "removed"),
      );
    });
    return unsubscribe;
  }, [patronId]);


  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);


  const handleAddViolation = () => {
    setIsViolationModalOpen(true);
  };

  const handleViolationConfirm = async (violation, description) => {
    try {
      const result = await runTransaction(
        ref(db, "counters/violations"),
        (current) => (current ?? 30) + 1,
      );
    
      if (!result.committed) throw new Error("Counter update failed");

      const n = result.snapshot.val();                      
      const id = `VIO-${String(n).padStart(3, "0")}`;      

      await set(ref(db, `violations/${n - 1}`), {
        id,
        patronId,
        transactionId: "",
        bookId: "",
        type: violation,
        description: description.trim(),
        dateRecorded: new Date().toISOString().slice(0, 10),
      });

      toast.success("Violation added successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add violation.");
      throw err;
    }
  };

  const handleRemoveViolation = async (key) => {
    try {
      await remove(ref(db, `violations/${key}`));
      toast.success("Violation removed successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove violation.");
    }
  };

  const handleClick = () => {
    navigate("/patrons");
  };
  const handleArchiveConfirm = async (actionType) => {
    const isLifting = actionType === "unsuspend";
    try {
      if (isLifting) {
        await liftSuspension(patronId);
        toast.success("Suspension lifted successfully.");
      } else {
        await suspendPatron(patronId);
        toast.success("Patron suspended successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        isLifting ? "Failed to lift suspension." : "Failed to suspend patron.",
      );
    }
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
              {isSuspended && (
                <span className="mb-2 inline-block rounded-full border border-[#A35139] px-3 py-0.5 text-xs text-[#A35139]">
                  Suspended
                </span>
              )}
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
            {isSuspended ? "Lift Suspension" : "Suspend Patron"}
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
        action={isSuspended ? "unsuspend" : "suspend"}
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