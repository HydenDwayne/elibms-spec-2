const PATRON_KEY = "elibms.patronOverrides";

const readOverrides = () => {
  try {
    return JSON.parse(localStorage.getItem(PATRON_KEY)) || {};
  } catch {
    return {};
  }
};

const saveOverride = (id, fields) => {
  const all = readOverrides();
  all[id] = { ...(all[id] || {}), ...fields };
  try {
    localStorage.setItem(PATRON_KEY, JSON.stringify(all));
  } catch {
    return;
  }
};

export const applyPatronOverride = (patron) => {
  if (!patron) return patron;
  return { ...patron, ...(readOverrides()[patron.id] || {}) };
};

export const suspendPatron = (patron) => {
  if (patron.status === "Suspended") {
    return { ok: false, message: "Patron is already suspended." };
  }
  saveOverride(patron.id, {
    status: "Suspended",
    suspendedAt: new Date().toISOString(),
  });
  return { ok: true, message: "Patron suspended." };
};

export const liftSuspension = (patron) => {
  if (patron.status !== "Suspended") {
    return { ok: false, message: "Patron is not suspended." };
  }
  saveOverride(patron.id, {
    status: "Active",
    suspendedAt: null,
  });
  return { ok: true, message: "Suspension lifted." };
};