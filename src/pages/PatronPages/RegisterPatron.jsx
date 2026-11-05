import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import BookStatus from "../../components/BookNFCStatus";
import ValidatedInput from "../../components/ValidatedInput";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useState } from "react";
import { LuNfc } from "react-icons/lu";
import { GoDot } from "react-icons/go";

import {
  usePatrons,
  getNextPatronId,
  addPatron,
} from "../../store/patronStore";
import {
  validatePatronForm,
  PHONE_LENGTH,
} from "../../utils/patronValidation";

const gradientText =
  "bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent";

const RegisterPatron = () => {
  const navigate = useNavigate();
  const patrons = usePatrons();
  const nextId = getNextPatronId(patrons); // auto-generate the next patron ID based on existing patrons

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    email: "",
    phone: "",
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dialog, setDialog] = useState(null); 

  const errors = validatePatronForm(form);
  const setField = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }));
  const errorFor = (key) => (touched[key] || submitted ? errors[key] || "" : "");

  // Only digits, max 11
  const setPhone = (value) =>
    setField("phone")(value.replace(/\D/g, "").slice(0, PHONE_LENGTH));
  // Only digits and dashes while typing the birthdate
  const setBirthDate = (value) =>
    setField("birthDate")(value.replace(/[^\d-]/g, "").slice(0, 10));

  const handleRegisterClick = () => {
    setSubmitted(true);
    setDialog(Object.keys(errors).length ? "invalid" : "confirm");
  };

  const handleConfirm = () => {
    addPatron(form);
    setDialog(null);
    navigate("/patrons");
  };

  return (
    <div className="px-15 py-10 w-full">
      <button
        className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#1D2937]"
        onClick={() => navigate("/patrons")}
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className={gradientText}>Back to Patrons</span>
      </button>

      <p className={`mb-8 text-2xl font-bold ${gradientText}`}>
        REGISTER NEW PATRON
      </p>

      <div className="grid grid-cols-2 gap-y-3 gap-x-25">
        <div>
          <p className={`mb-5 text-lg font-bold ${gradientText}`}>
            Patron Information
          </p>
          <ValidatedInput
            label="First Name"
            value={form.firstName}
            onChange={setField("firstName")}
            onBlur={touch("firstName")}
            error={errorFor("firstName")}
          />
          <div className="grid grid-cols-2 gap-x-4">
            <ValidatedInput
              label="Last Name"
              value={form.lastName}
              onChange={setField("lastName")}
              onBlur={touch("lastName")}
              error={errorFor("lastName")}
            />
            <ValidatedInput
              label="Middle Name"
              value={form.middleName}
              onChange={setField("middleName")}
              placeholder="optional"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <ValidatedInput
              label="ID Number (auto)"
              value={nextId}
              readOnly
            />
            <ValidatedInput
              label="Birthdate"
              value={form.birthDate}
              onChange={setBirthDate}
              onBlur={touch("birthDate")}
              error={errorFor("birthDate")}
              placeholder="YYYY-MM-DD"
              inputMode="numeric"
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-4">
            <p
              className={`col-span-2 mb-3 text-sm font-bold ${gradientText}`}
            >
              Contact Information
            </p>
            <ValidatedInput
              label="Email Address"
              value={form.email}
              onChange={setField("email")}
              onBlur={touch("email")}
              error={errorFor("email")}
              placeholder="name@example.com"
            />
            <ValidatedInput
              label="Phone Number"
              value={form.phone}
              onChange={setPhone}
              onBlur={touch("phone")}
              error={errorFor("phone")}
              maxLength={PHONE_LENGTH}
              inputMode="numeric"
              placeholder="09XXXXXXXXX"
            />
          </div>
        </div>
        <div>
          <p className={`mb-11 text-lg font-bold ${gradientText}`}>
            Link NFC Card
          </p>
          <div className="grid grid-rows-2 gap-x-25">
            <div className="py-15 bg-white rounded-sm flex justify-center items-center flex-col border border-[#545F71]">
              <LuNfc className="size-10" />
              <p className={`mt-2 font-semibold ${gradientText}`}>
                Place the NFC card near the receiver
              </p>
            </div>
            <div className="grid grid-rows-2">
              <BookStatus value="Waiting for card..." icon={GoDot} />
              <div className="flex flex-row justify-between">
                <button
                  onClick={() => navigate("/patrons")}
                  className="h-9 w-65 rounded-sm border border-[#1D2937] bg-white text-sm font-semibold text-[#1D2937]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="h-9 w-65 rounded-sm bg-gradient-to-r from-[#1D2937] to-[#53759D] text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
                >
                  Register Patron
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={dialog === "confirm"}
        variant="warning"
        title="Register this patron?"
        message={`You are about to register ${form.lastName.trim()}, ${form.firstName.trim()} as ${nextId}. Please make sure the details are correct.`}
        confirmText="Register"
        onConfirm={handleConfirm}
        onClose={() => setDialog(null)}
      />
      <ConfirmDialog
        isOpen={dialog === "invalid"}
        variant="error"
        title="Incomplete or invalid details"
        message="Please fix the following before registering:"
        details={Object.values(errors)}
        onClose={() => setDialog(null)}
      />
    </div>
  );
};

export default RegisterPatron;
