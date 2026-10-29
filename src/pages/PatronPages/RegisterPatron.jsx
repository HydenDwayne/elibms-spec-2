import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FormInput from "../../components/FormInput";
import MainButton from "../../components/MainButton";
import SecondaryButton from "../../components/SecondaryButton";
import BookStatus from "../../components/BookNFCStatus";
import { useState } from "react";
import { LuUpload, LuNfc } from "react-icons/lu";
import { GoDot, GoDotFill } from "react-icons/go";

const RegisterPatron = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleClick = () => {
    navigate("/patrons");
  };

  return (
    <div className="px-15 py-10 w-full">
      <button
        className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#1D2937]"
        onClick={handleClick}
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className="bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
          Back to Patrons
        </span>
      </button>

      <p className="mb-8 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        REGISTER NEW PATRON
      </p>

      <div className="grid grid-cols-2 gap-y-3 gap-x-25">
        <div>
          <p className="mb-5 text-lg font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            Patron Information
          </p>
          <FormInput
            label="First Name"
            length="w-full"
            value={firstName}
            onChange={setFirstName}
            placeholder=""
          />
          <div className="grid grid-cols-2 gap-x-4">
            <FormInput
              label="Last Name"
              length="w-full"
              value={lastName}
              onChange={setLastName}
              placeholder=""
            />
            <FormInput
              label="Middle Name"
              length="w-full"
              value={middleName}
              onChange={setMiddleName}
              placeholder="optional"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <FormInput
              label="ID Number"
              length="w-full"
              value={studentNumber}
              onChange={setStudentNumber}
              placeholder=""
            />
            <FormInput
              label="Birthdate"
              length="w-full"
              value={birthDate}
              onChange={setBirthDate}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-4">
            <p className="col-span-2 mb-3 text-sm font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
              Contact Information
            </p>
            <FormInput
              label="Email Address"
              length="w-full"
              value={emailAddress}
              onChange={setEmailAddress}
              placeholder=""
            />
            <FormInput
              label="Phone Number"
              length="w-full"
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder=""
            />
          </div>
        </div>
        <div>
          <p className="mb-11 text-lg font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            Link NFC Card
          </p>
          <div className="grid grid-rows-2 gap-x-25">
            <div className="py-15 bg-white rounded-sm flex justify-center items-center flex-col border border-[#545F71]">
              <LuNfc className="size-10" />
              <p className="mt-2 font-semibold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
                Place the NFC card near the receiver
              </p>
            </div>
            <div className="grid grid-rows-2">
              <BookStatus value="Waiting for card..." icon={GoDot} />
              <div className="flex flex-row justify-between">
                <SecondaryButton text={"Cancel"} to={"cancel-patron-register"} />
                <MainButton text={"Register Patron"} to={"register-new-patron"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPatron;
