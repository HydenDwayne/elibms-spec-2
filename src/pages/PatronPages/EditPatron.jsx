import { useNavigate, useParams } from "react-router-dom";
import ValidatedInput from "../../components/ValidatedInput";
import ConfirmDialog from "../../components/ConfirmDialog";
import SecondaryButton from "../../components/SecondaryButton";
import BookStatus from "../../components/BookNFCStatus";
import { useState } from "react";
import { LuNfc } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";

import { usePatrons, updatePatron } from "../../store/patronStore";
import {
  validatePatronForm,
  PHONE_LENGTH,
} from "../../utils/patronValidation";

const gradientText =
  "bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent";

const EditPatron = () => {
  const navigate = useNavigate();
  const { patronId } = useParams();
  const patron = usePatrons().find((p) => p.id === patronId);

  const [form, setForm] = useState({
    firstName: patron?.firstName ?? "",
    lastName: patron?.lastName ?? "",
    middleName: patron?.middleName ?? "",
    birthDate: patron?.birthDate ?? "",
    email: patron?.email ?? "",
    phone: patron?.contactNo ?? "",
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dialog, setDialog] = useState(null); // null | "confirm" | "invalid"

  if (!patron) return <p className="p-10">Patron not found.</p>;

  const errors = validatePatronForm(form);
  const setField = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }));
  const errorFor = (key) => (touched[key] || submitted ? errors[key] || "" : "");

  const setPhone = (value) =>
    setField("phone")(value.replace(/\D/g, "").slice(0, PHONE_LENGTH));
  const setBirthDate = (value) =>
    setField("birthDate")(value.replace(/[^\d-]/g, "").slice(0, 10));

  const handleSaveClick = () => {
    setSubmitted(true);
    setDialog(Object.keys(errors).length ? "invalid" : "confirm");
  };

  const handleConfirm = () => {
    updatePatron(patronId, form);
    setDialog(null);
    navigate(`/patrons/${patronId}`);
  };

  return (
    <div className="px-15 py-10 w-full">
      <p className={`mb-10 text-2xl font-bold ${gradientText}`}>
        EDITING {patron.name}
      </p>

      <div className="grid grid-cols-2 gap-y-3 gap-x-25">
        <div>
          <p className={`mb-8 text-lg font-bold ${gradientText}`}>
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
            <ValidatedInput label="ID Number" value={patron.id} readOnly />
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
          <div className="mt-8 grid grid-cols-2 gap-x-4">
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
          <p className={`mb-13 text-lg font-bold ${gradientText}`}>
            Link NFC Card
          </p>
          <div className="grid grid-rows-2 gap-x-25">
            <div className="py-10 bg-white rounded-sm flex justify-center items-center flex-col border border-[#545F71]">
              <LuNfc className="size-10" />
              <p className={`mb-5 mt-2 font-semibold ${gradientText}`}>
                {patron.tagId || "No card linked"}
              </p>
              {patron.tagId && (
                <SecondaryButton text={"Unlink Tag"} to={"unlink-tag"} />
              )}
            </div>
            <div className="mt-3 grid grid-rows-2">
              <BookStatus
                value={patron.tagId ? "Linked" : "Not Linked"}
                icon={GoDotFill}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-row justify-center gap-6">
        <button
          onClick={() => navigate(`/patrons/${patronId}`)}
          className="h-9 w-65 rounded-sm border border-[#1D2937] bg-white text-sm font-semibold text-[#1D2937]"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveClick}
          className="h-9 w-65 rounded-sm bg-gradient-to-r from-[#1D2937] to-[#53759D] text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
        >
          Save Changes
        </button>
      </div>

      <ConfirmDialog
        isOpen={dialog === "confirm"}
        variant="warning"
        title="Save changes?"
        message={`This will update the details of ${patron.name}.`}
        confirmText="Save"
        onConfirm={handleConfirm}
        onClose={() => setDialog(null)}
      />
      <ConfirmDialog
        isOpen={dialog === "invalid"}
        variant="error"
        title="Incomplete or invalid details"
        message="Please fix the following before saving:"
        details={Object.values(errors)}
        onClose={() => setDialog(null)}
      />
    </div>
  );
};

export default EditPatron;
