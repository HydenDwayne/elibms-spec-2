import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { auth, db } from "../lib/firebase";

const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];

const inputClass = (invalid) =>
  `h-10 w-full rounded-sm border bg-white px-3 text-sm text-[#1D2937] outline-none transition-colors duration-200 disabled:opacity-60 ${
    invalid ? "border-red-500 focus:border-red-500" : "border-[#545F71] focus:border-[#c96d45]"
  }`;

const authMessages = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/weak-password": "Password must be at least 8 characters.",
  "auth/operation-not-allowed": "Email/password sign-up is disabled.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (f) => {
  const errors = {};
  if (!f.name.trim()) errors.name = "Full name is required";
  if (!f.displayName.trim()) errors.displayName = "Display name is required";
  if (!f.birthDate) errors.birthDate = "Date of birth is required";
  else if (f.birthDate > new Date().toISOString().slice(0, 10))
    errors.birthDate = "Date of birth can't be in the future";
  if (!f.gender) errors.gender = "Select a gender";
  if (!EMAIL_RE.test(f.email.trim())) errors.email = "Enter a valid email";
  if (f.username.trim().length < 4)
    errors.username = "Username must be at least 4 characters";
  if (f.password.length < 8)
    errors.password = "Password must be at least 8 characters";
  if (f.confirmPassword !== f.password)
    errors.confirmPassword = "Passwords do not match";
  return errors;
};

function Field({ id, label, error, children }) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`mb-1 block text-sm ${error ? "text-red-500" : "text-[#545F71]"}`}
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    birthDate: "",
    gender: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const email = form.email.trim();
      const cred = await createUserWithEmailAndPassword(auth, email, form.password);

      // Same shape the app reads from librarians/{uid} (see LibrarianContext)
      await set(ref(db, `librarians/${cred.user.uid}`), {
        name: form.name.trim(),
        displayName: form.displayName.trim(),
        birthDate: form.birthDate,
        gender: form.gender,
        email,
        username: form.username.trim(),
        avatar: null,
      });

      navigate("/", { replace: true });
    } catch (err) {
      setFormError(
        authMessages[err.code] || "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-800 via-orange-900 to-orange-700 px-4 py-10">
      <Helmet>
        <title>ELIBMS | Register</title>
      </Helmet>

      <div className="w-full max-w-lg rounded-md bg-[#fdfdfd] p-8 shadow-xl">
        <h1 className="bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-2xl font-bold text-transparent">
          ELIBMS
        </h1>
        <p className="mb-6 mt-1 text-sm text-[#545F71]">
          Register as Librarian
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <p className="bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-sm font-bold text-transparent">
            Personal Information
          </p>

          <Field id="name" label="Full Name" error={errors.name}>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className={inputClass(errors.name)}
              value={form.name}
              onChange={setField("name")}
              disabled={loading}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="displayName" label="Display Name" error={errors.displayName}>
              <input
                id="displayName"
                type="text"
                className={inputClass(errors.displayName)}
                value={form.displayName}
                onChange={setField("displayName")}
                disabled={loading}
              />
            </Field>
            <Field id="birthDate" label="Birthdate" error={errors.birthDate}>
              <input
                id="birthDate"
                type="date"
                autoComplete="bday"
                max={new Date().toISOString().slice(0, 10)}
                className={inputClass(errors.birthDate)}
                value={form.birthDate}
                onChange={setField("birthDate")}
                disabled={loading}
              />
            </Field>
          </div>

          <Field id="gender" label="Gender" error={errors.gender}>
            <select
              id="gender"
              className={inputClass(errors.gender)}
              value={form.gender}
              onChange={setField("gender")}
              disabled={loading}
            >
              <option value="">Select...</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>

          <p className="mt-2 bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-sm font-bold text-transparent">
            Account Information
          </p>

          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={inputClass(errors.email)}
              value={form.email}
              onChange={setField("email")}
              disabled={loading}
            />
          </Field>

          <Field id="username" label="Username" error={errors.username}>
            <input
              id="username"
              type="text"
              autoComplete="username"
              className={inputClass(errors.username)}
              value={form.username}
              onChange={setField("username")}
              disabled={loading}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="password" label="Password" error={errors.password}>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`${inputClass(errors.password)} pr-10`}
                  value={form.password}
                  onChange={setField("password")}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#53657a]"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </Field>
            <Field
              id="confirmPassword"
              label="Confirm Password"
              error={errors.confirmPassword}
            >
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={inputClass(errors.confirmPassword)}
                value={form.confirmPassword}
                onChange={setField("confirmPassword")}
                disabled={loading}
              />
            </Field>
          </div>

          {formError && (
            <p role="alert" className="text-sm text-red-500">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 w-full rounded-sm bg-gradient-to-r from-[#1D2937] to-[#53759D] text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#545F71]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#c96d45] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}