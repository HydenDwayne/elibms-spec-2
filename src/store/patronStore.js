// Tiny shared store so the table, register page, edit page and details page
// all see the same list of patrons (the JSON import alone can't be mutated).
import { useSyncExternalStore } from "react";
import data from "../data/dummy_data.json";

let patrons = [...data.patrons];
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => patrons;

export const usePatrons = () => useSyncExternalStore(subscribe, getSnapshot);

// "PT-0014" -> 14. Next id = highest existing number + 1.
export const getNextPatronId = (list = patrons) => {
  const max = list.reduce((acc, p) => {
    const n = parseInt(String(p.id).replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return `PT-${String(max + 1).padStart(4, "0")}`;
};

// MM/DD/YYYY, same as the "Date Registered" column.
const formatToday = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
};

const buildName = ({ lastName, firstName, middleName }) =>
  `${lastName.trim()}, ${firstName.trim()}${
    middleName.trim() ? " " + middleName.trim() : ""
  }`;

export const addPatron = (form) => {
  const newPatron = {
    id: getNextPatronId(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    middleName: form.middleName.trim(),
    name: buildName(form),
    birthDate: form.birthDate.trim(),
    email: form.email.trim(),
    contactNo: form.phone,
    dateRegistered: formatToday(),
    nfcStatus: "Not Linked",
    tagId: "",
  };
  patrons = [...patrons, newPatron];
  emit();
  return newPatron;
};

export const updatePatron = (id, form) => {
  patrons = patrons.map((p) =>
    p.id === id
      ? {
          ...p,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          middleName: form.middleName.trim(),
          name: buildName(form),
          birthDate: form.birthDate.trim(),
          email: form.email.trim(),
          contactNo: form.phone,
        }
      : p,
  );
  emit();
};
