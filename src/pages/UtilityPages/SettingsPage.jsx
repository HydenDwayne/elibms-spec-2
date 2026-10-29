import { useRef, useState } from "react";
import { FiEdit, FiCamera, FiCheck, FiX } from "react-icons/fi";
import pfp from "../../assets/default.webp";
import data from "../../data/dummy_data.json";

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

// One row of the table: label | value | edit icon. Switches to an input when editing.
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

  const startEdit = () => {
    setDraft(masked ? "" : value);
    setError("");
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setError("");
  };

  const save = () => {
    const message = validate ? validate(draft) : "";
    if (message) {
      setError(message);
      return;
    }
    onSave(draft);
    setEditing(false);
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
              aria-label={`Save ${label}`}
              className="text-lg text-green-700 transition-transform hover:scale-110"
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
  const [avatar, setAvatar] = useState(null);

  const u = data.users[0];
  const [profile, setProfile] = useState({
    name: u.name,
    birthDate: u.birthDate,
    gender: u.gender,
    email: u.email,
  });
  const [account, setAccount] = useState({
    username: u.username,
    password: "placeholder",
  });

  const setProfileField = (key) => (val) =>
    setProfile((p) => ({ ...p, [key]: val }));
  const setAccountField = (key) => (val) =>
    setAccount((a) => ({ ...a, [key]: val }));

  const required = (label) => (v) => (v.trim() ? "" : `${label} is required`);

  const handlePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatar) URL.revokeObjectURL(avatar);
    setAvatar(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemovePicture = () => {
    if (avatar) URL.revokeObjectURL(avatar);
    setAvatar(null);
  };

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
                src={avatar ?? pfp}
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
              disabled={!avatar}
              className="mt-2 text-xs text-red-600 underline disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>

          <div className="flex-1">
            <SettingRow
              label="Name"
              value={profile.name}
              onSave={setProfileField("name")}
              validate={required("Name")}
            />
            <SettingRow
              label="Date of Birth"
              type="date"
              value={profile.birthDate}
              display={formatDate(profile.birthDate)}
              onSave={setProfileField("birthDate")}
              validate={(v) => (v ? "" : "Date of birth is required")}
            />
            <SettingRow
              label="Gender"
              value={profile.gender}
              options={["Female", "Male", "Other", "Prefer not to say"]}
              onSave={setProfileField("gender")}
            />
            <SettingRow
              label="Email"
              type="email"
              value={profile.email}
              onSave={setProfileField("email")}
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
            value={account.username}
            onSave={setAccountField("username")}
            validate={(v) =>
              v.trim().length >= 4
                ? ""
                : "Username must be at least 4 characters"
            }
          />
          <SettingRow
            label="Password"
            value={account.password}
            masked
            onSave={setAccountField("password")}
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
