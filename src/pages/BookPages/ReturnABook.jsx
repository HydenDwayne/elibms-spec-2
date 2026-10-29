import SecondaryButton from "../../components/SecondaryButton";
import { LuNfc } from "react-icons/lu";

const ReturnABook = () => {
  return (
    <div className="px-15 py-10 w-full">
      <p className="mb-8 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        RETURN BOOK
      </p>

      <div>
        <div className="flex flex-col px-55 mt-25">
          <div className=" py-30 bg-white rounded-sm flex justify-center items-center flex-col border border-[#545F71]">
            <LuNfc className="size-10" />

            <p className="mt-2 font-semibold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
              Place the NFC tag near the receiver
            </p>
          </div>
          <p className="flex justify-center text-sm text-[#545F71] mt-5">
            Waiting for NFC tag...
          </p>
          <div className="mt-20 flex flex-row justify-center">
            <SecondaryButton text={"Cancel"} to={"cancel-return-book"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnABook;
