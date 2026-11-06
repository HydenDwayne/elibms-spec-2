import { useRef, useState } from "react";
import { FiEdit, FiCamera, FiCheck, FiX } from "react-icons/fi";
import { updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import pfp from "../../assets/default.webp";
import { auth } from "../../lib/firebase";
import { useLibrarian } from "../../components/LibrarianContext";

const gradientText =
  "bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent";

const formatDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const authMessage = (err) =>
  err.code === "auth/requires-recent-login"
    ? "For security, please log out and log in again, then retry."
    : "Couldn't update. Please try again.";

const resizeImage = (file, size = 256) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, size / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });

function SettingRow({
  label,
  value,
  display,
  type = "text",
  options,
  onSave,
  validate,
  masked = false,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setDraft(masked ? "" : value);
    setError("");
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setError("");
  };

  const save = async () => {
    if (saving) return;
    const message = validate ? validate(draft) : "";
    if (message) {
      setError(message);
      return;
    }
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
      setError("");
    } catch (err) {
      setError(err.message || "Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "h-9 w-full max-w-xs rounded-sm border border-[#545F71] bg-white px-3 text-sm text-[#53657a] outline-none transition-colors duration-200 focus:border-[#c96d45]";

  return (
    <div className="flex min-h-12 items-center border-b border-[#545F71]/60 py-2 first:border-t">
      <p className="w-40 shrink-0 pl-2 text-xs text-[#545F71]">{label}</p>

      <div className="flex-1">
        {editing ? (
          <>
            {options ? (
              <select
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={inputClass}
              >
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                autoFocus
                type={masked ? "password" : type}
                value={draft}
                placeholder={masked ? "Enter new password" : ""}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                  if (e.key === "Escape") cancel();
                }}
                className={inputClass}
              />
            )}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </>
        ) : (
          <p className="text-base text-[#545F71]">
            {masked ? "**********" : (display ?? value)}
          </p>
        )}
      </div>

      <div className="flex w-16 shrink-0 items-center justify-end gap-2 pr-3">
        {editing ? (
          <>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              aria-label={`Save ${label}`}
              className="text-lg text-green-700 transition-transform hover:scale-110 disabled:opacity-40"
            >
              <FiCheck />
            </button>
            <button
              type="button"
              onClick={cancel}
              aria-label={`Cancel editing ${label}`}
              className="text-lg text-red-600 transition-transform hover:scale-110"
            >
              <FiX />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            aria-label={`Edit ${label}`}
            className="text-lg text-[#c96d45] transition-transform hover:scale-110"
          >
            <FiEdit />
          </button>
        )}
      </div>
    </div>
  );
}

const SettingsPage = () => {
  const fileRef = useRef(null);
  const { librarian, updateLibrarian, error } = useLibrarian();

  const saveField = (key) => (val) => updateLibrarian({ [key]: val });

  const saveEmail = async (val) => {
    try {
      await verifyBeforeUpdateEmail(auth.currentUser, val);
    } catch (err) {
      throw new Error(authMessage(err));
    }
    await updateLibrarian({ email: val });
  };

  const savePassword = async (val) => {
    try {
      await updatePassword(auth.currentUser, val);
    } catch (err) {
      throw new Error(authMessage(err));
    }
  };

  const required = (label) => (v) => (v.trim() ? "" : `${label} is required`);

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    await updateLibrarian({ avatar: await resizeImage(file) });
  };

  const handleRemovePicture = () => updateLibrarian({ avatar: null });

  if (!librarian)
    return (
      <p className="p-10 text-sm text-red-600">{error || "Loading..."}</p>
    );

  return (
    <div className="h-full w-full overflow-y-auto px-15 pt-10 pb-10">
      <p className={`mb-8 text-2xl font-bold ${gradientText}`}>SETTINGS</p>

      {/* Personal Info */}
      <section className="px-10">
        <h2 className={`mb-6 text-2xl font-normal ${gradientText}`}>
          Personal Info
        </h2>

        <div className="flex flex-row items-start gap-10">
          <div className="flex w-40 shrink-0 flex-col items-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Change profile picture"
              className="group relative size-30 overflow-hidden rounded-full bg-gradient-to-b from-[#f0e6e0] to-[#8a7d76]"
            >
              <img
                src={librarian.avatar ?? pfp}
                alt="profile_picture"
                className="size-full object-cover"
              />
              <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-transparent to-black/30 pb-4 text-white">
                <FiCamera className="text-2xl transition-transform group-hover:scale-110" />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePictureChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-4 text-xs text-[#c96d45] underline"
            >
              Change Profile Picture
            </button>
            <button
              type="button"
              onClick={handleRemovePicture}
              disabled={!librarian.avatar}
              className="mt-2 text-xs text-red-600 underline disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>

          <div className="flex-1">
            <SettingRow
              label="Name"
              value={librarian.name}
              onSave={saveField("name")}
              validate={required("Name")}
            />
            <SettingRow
              label="Display Name"
              value={librarian.displayName}
              onSave={saveField("displayName")}
              validate={required("Display name")}
            />
            <SettingRow
              label="Date of Birth"
              type="date"
              value={librarian.birthDate}
              display={formatDate(librarian.birthDate)}
              onSave={saveField("birthDate")}
              validate={(v) => (v ? "" : "Date of birth is required")}
            />
            <SettingRow
              label="Gender"
              value={librarian.gender}
              options={["Female", "Male", "Other", "Prefer not to say"]}
              onSave={saveField("gender")}
            />
            <SettingRow
              label="Email"
              type="email"
              value={librarian.email}
              onSave={saveEmail}
              validate={(v) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
                  ? ""
                  : "Enter a valid email"
              }
            />
          </div>
        </div>
      </section>

      <div className="my-10 h-0.5 w-full bg-gradient-to-r from-[#A8573F] to-[#F2A65A]" />

      {/* Account Info */}
      <section className="px-10">
        <h2 className={`mb-6 text-2xl font-normal ${gradientText}`}>
          Account Info
        </h2>

        <div className="ml-50">
          <SettingRow
            label="Username"
            value={librarian.username}
            onSave={saveField("username")}
            validate={(v) =>
              v.trim().length >= 4
                ? ""
                : "Username must be at least 4 characters"
            }
          />
          <SettingRow
            label="Password"
            value=""
            masked
            onSave={savePassword}
            validate={(v) =>
              v.length >= 8 ? "" : "Password must be at least 8 characters"
            }
          />
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
