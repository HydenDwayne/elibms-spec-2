import SecondaryButton from "../../components/SecondaryButton";
import MainButton from "../../components/MainButton";
import { LuNfc } from "react-icons/lu";
import JJK from "../../assets/Jujutsu_kaisen.jpg";
import pfp from "../../assets/default.webp";

const BorrowABookTransaction = () => {
  return (
    <div className="px-15 py-10 w-full">
      <p className=" text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        BORROW BOOK
      </p>

      <div className="flex flex-row justify-evenly">
        <div className="flex flex-col px-20 mt-5 w-100">
          <div className="mt-10 flex flex-col items-center">
            <div className=" w-45 h-60 flex justify-center">
              <img src={JJK} alt="JJK" />
            </div>
            <div className=" w-60">
              <p className="text-lg font-semibold">Jujutsu Kaisen, Vol. 1</p>
              <p className="mb-5">Author: Gege Akutami</p>
              <div className="text-sm">
                <p>ISBN: M1231</p>
                <p>Call Number: B-1242</p>
                <p>Publication Year: 2018</p>
                <p>Genre: Manga</p>
                <p>Borrowable: Yes</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-20 mt-5 w-100">
          <div className="mt-10 flex flex-col items-center">
            <div className="w-50 h-50 rounded-full flex justify-center bg-red-500">
              <img className="rounded-full" src={pfp} alt="pfp" />
            </div>
            <div className="mt-7 w-60">
              <p className="text-lg font-semibold">Name: Baisa, Ivan Philip Pagatpat</p>
              <p className="mb-5">ID: PT0001</p>
              <div className="text-sm">
                <p>Email: ivanisthegoat6767@gmail.com</p>
                <p>Contact No.: 09336069666</p>
                <p>Date Registered: 09/09/2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col items-center">
        <p className=" text-xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
          Approve loan transaction?
        </p>
      </div>
      <div className="mt-5 flex flex-row justify-center gap-10">
        <SecondaryButton text={"Cancel"} to={"cancel-borrow-book-2"} />
        <MainButton text={"Confirm"} to={"borrow-book"} />
      </div>
    </div>
  );
};

export default BorrowABookTransaction;
