export const PHONE_LENGTH = 11;

export const validateRequired = (label) => (value) =>
  value.trim() ? "" : `${label} is required.`;

export const validateEmail = (value) => {
  const v = value.trim();
  if (!v) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
    return "Enter a valid email (e.g. name@example.com).";
  return "";
};

export const validatePhone = (value) => {
  if (!value) return "Contact number is required.";
  if (!/^\d+$/.test(value)) return "Contact number must contain digits only.";
  if (value.length !== PHONE_LENGTH)
    return `Contact number must be ${PHONE_LENGTH} digits (${value.length}/${PHONE_LENGTH}).`;
  return "";
};

export const validateBirthDate = (value) => {
  const v = value.trim();
  if (!v) return "Birthdate is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Use the format YYYY-MM-DD.";

  const [y, m, d] = v.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const isRealDate =
    date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  if (!isRealDate) return "That date does not exist.";
  if (y < 1900) return "Year must be 1900 or later.";
  if (date > new Date()) return "Birthdate cannot be in the future.";
  return "";
};

// Returns { field: "error message" } containing only the invalid fields.
export const validatePatronForm = (form) => {
  const all = {
    firstName: validateRequired("First name")(form.firstName),
    lastName: validateRequired("Last name")(form.lastName),
    birthDate: validateBirthDate(form.birthDate),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone),
  };
  return Object.fromEntries(Object.entries(all).filter(([, msg]) => msg));
};
