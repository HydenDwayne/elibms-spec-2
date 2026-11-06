import { useSyncExternalStore } from "react";

import {
  ref,
  push,
  set,
  update,
  serverTimestamp,
} from "firebase/database";

import { db } from "../lib/firebase";
import { listenToPatrons } from "../lib/patronActions";


/* ---------- Shared Firebase Store ---------- */

let patrons = [];
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => patrons;

export const usePatrons = () =>
  useSyncExternalStore(subscribe, getSnapshot);

/* ---------- Firebase Listener ---------- */

// Start listening to Firebase once.
let unsubscribeFirebase = null;

export const initializePatronStore = () => {
  if (unsubscribeFirebase) return;

  unsubscribeFirebase = listenToPatrons((firebasePatrons) => {
    patrons = firebasePatrons ?? [];
    emit();
  });
};

// Automatically start listening.
initializePatronStore();

/* ---------- Patron ID ---------- */

export const getNextPatronId = (list = patrons) => {
  const max = list.reduce((acc, patron) => {
    const number = parseInt(String(patron.id).replace(/\D/g, ""), 10);

    return Number.isNaN(number)
      ? acc
      : Math.max(acc, number);
  }, 0);

  return `PT-${String(max + 1).padStart(4, "0")}`;
};

/* ---------- Helpers ---------- */

const formatToday = () => {
  const date = new Date();

  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${mm}/${dd}/${date.getFullYear()}`;
};

const buildName = ({ lastName, firstName, middleName }) =>
  `${lastName.trim()}, ${firstName.trim()}${
    middleName.trim() ? " " + middleName.trim() : ""
  }`;

/* ---------- Add Patron ---------- */

export const addPatron = async (form, id) => {
  const newPatron = {
    id,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    middleName: form.middleName.trim(),
    name: buildName(form),
    birthDate: form.birthDate.trim(),
    email: form.email.trim(),
    contactNo: form.phone.trim(),
    dateRegistered: formatToday(),
    nfcStatus: "Not Linked",
    tagId: "",
    status: "Active",
    createdAt: serverTimestamp(),
  };

  
  await set(ref(db, `patrons/${id}`), newPatron);

  return {
    ...newPatron,
    key: id,
  };
};

/* ---------- Update Patron ---------- */

export const updatePatron = async (key, form) => {
  const patron = patrons.find(
    (item) => item.id === key || item.key === key
  );

  if (!patron) {
    throw new Error("Patron not found.");
  }

  await update(ref(db, `patrons/${patron.key}`), {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    middleName: form.middleName.trim(),
    name: buildName(form),
    birthDate: form.birthDate.trim(),
    email: form.email.trim(),
    contactNo: form.phone.trim(),
    updatedAt: serverTimestamp(),
  });
};