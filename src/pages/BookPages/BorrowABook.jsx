import SecondaryButton from "../../components/SecondaryButton";
import { LuNfc } from "react-icons/lu";

const BorrowABook = () => {
  return (
    <div className="px-15 py-10 w-full">
      <p className="mb-8 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        BORROW BOOK
      </p>

      <div className="flex flex-row justify-center">
        <div className="flex flex-col px-20 mt-5">
          <p className="text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            Book Details
          </p>
          <div className="mt-10 py-30 w-100 bg-white rounded-sm flex justify-center items-center flex-col border border-[#545F71]">
            <LuNfc className="size-10" />

            <p className="mt-2 font-semibold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
              Scan Book
            </p>
          </div>
          <p className="flex justify-center text-sm text-[#545F71] mt-5">
            Waiting for NFC tag...
          </p>
        </div>
        <div className="flex flex-col px-20 mt-5">
          <p className=" text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            Patron Details
          </p>
          <div className="mt-10 py-30 w-100 bg-white rounded-sm flex justify-center items-center flex-col border border-[#545F71]">
            <LuNfc className="size-10" />

            <p className="mt-2 font-semibold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
              Scan Library Card
            </p>
          </div>
          <p className="flex justify-center text-sm text-[#545F71] mt-5">
            Waiting for NFC tag...
          </p>
        </div>
      </div>
      <div className="mt-20 flex flex-row justify-center">
        <SecondaryButton text={"Cancel"} to={"cancel-borrow-book"} />
      </div>
    </div>
  );
};

export default BorrowABook;
