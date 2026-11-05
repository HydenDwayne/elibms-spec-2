import { ref, update, onValue, serverTimestamp } from "firebase/database";
import { db, auth } from "./firebase";

export const suspendPatron = (patronId) =>
  update(ref(db, `patrons/${patronId}`), {
    status: "Suspended",
    suspendedAt: serverTimestamp(),
    suspendedBy: auth.currentUser?.uid ?? null,
  });

export const liftSuspension = (patronId) =>
  update(ref(db, `patrons/${patronId}`), {
    status: "Active",
    liftedAt: serverTimestamp(),
    liftedBy: auth.currentUser?.uid ?? null,
  });

export const listenToPatronStatus = (patronId, callback) =>
  onValue(
    ref(db, `patrons/${patronId}/status`),
    (snap) => callback(snap.val()),
    (err) => console.error(err),
  );

export const listenToPatronStatuses = (callback) =>
  onValue(
    ref(db, "patrons"),
    (snap) => {
      const statuses = {};
      Object.entries(snap.val() ?? {}).forEach(([id, patron]) => {
        if (patron?.status) statuses[id] = patron.status;
      });
      callback(statuses);
    },
    (err) => console.error(err),
  );