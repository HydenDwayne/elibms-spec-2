import { useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FormInput from "../../components/FormInput";
import MainButton from "../../components/MainButton";
import SecondaryButton from "../../components/SecondaryButton";
import BookStatus from "../../components/BookNFCStatus";
import { useState } from "react";
import { LuUpload, LuNfc } from "react-icons/lu";
import { GoDot, GoDotFill } from "react-icons/go";

import data from "../../data/dummy_data.json";

const EditPatron = () => {
  const { patronId } = useParams();
  const patron = data.patrons.find((p) => p.id === patronId);
  const [firstName, setFirstName] = useState(patron.firstName);
  const [studentNumber, setStudentNumber] = useState(patron.studentNumber);
  const [birthDate, setBirthDate] = useState(patron.birthDate);
  const [emailAddress, setEmailAddress] = useState(patron.email);
  const [lastName, setLastName] = useState(patron.lastName);
  const [middleName, setMiddleName] = useState(patron.middleName);
  const [phoneNumber, setPhoneNumber] = useState(patron.contactNo);

  

  return (
    <div className="px-15 py-10 w-full">
      <p className="mb-10 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        EDITING {patron.name}
      </p>

      <div className="grid grid-cols-2 gap-y-3 gap-x-25">
        <div>
          <p className="mb-8 text-lg font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
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
              placeholder=""
            />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4">
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
          <p className="mb-13 text-lg font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            Link NFC Card
          </p>
          <div className="grid grid-rows-2 gap-x-25">
            <div className="py-10 bg-white rounded-sm flex justify-center items-center flex-col border border-[#545F71]">
              <LuNfc className="size-10" />
              <p className="mb-5 mt-2 font-semibold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
                {patron.tagId}
              </p>
              <SecondaryButton text={"Unlink Tag"} to={"unlink-tag"} />
            </div>
            <div className="mt-3 grid grid-rows-2">
              <BookStatus value="Linked" icon={GoDotFill} />
            </div>
          </div>
        </div>
      </div>
        <div className=" flex flex-row justify-center gap-6">
          <SecondaryButton
            text={"Cancel"}
            to={"cancel-patron-edit"}
            id={patronId}
          />
          <MainButton
            text={"Save Changes"}
            to={"save-patron-edit"}
            id={patronId}
          />
        </div>
    </div>
  );
};

export default EditPatron;
