import { ref, update, onValue, serverTimestamp } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";

/* ---------- Writes ---------- */

const requireUser = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in to perform this action.");
  return user;
};

export const suspendPatron = (patronId) => {
  const user = requireUser();
  return update(ref(db, `patrons/${patronId}`), {
    status: "Suspended",
    suspendedAt: serverTimestamp(),
    suspendedBy: user.uid,
  });
};

export const liftSuspension = (patronId) => {
  const user = requireUser();
  return update(ref(db, `patrons/${patronId}`), {
    status: "Active",
    liftedAt: serverTimestamp(),
    liftedBy: user.uid,
  });
};

/* ---------- Listeners ---------- */

/**
 * Attaches a database listener only once the user is signed in, and
 * re-attaches it if auth state changes. Returns an unsubscribe function.
 */
const listenWhenAuthed = (path, onData, onSignedOut) => {
  let unsubDb = null;

  const detach = () => {
    if (unsubDb) {
      unsubDb();
      unsubDb = null;
    }
  };

  const unsubAuth = onAuthStateChanged(auth, (user) => {
    detach();

    if (!user) {
      onSignedOut?.();
      return;
    }

    unsubDb = onValue(ref(db, path), onData, (err) => {
      console.error(`Listener error at ${path}:`, err);
    });
  });

  return () => {
    unsubAuth();
    detach();
  };
};

export const listenToPatronStatus = (patronId, callback) =>
  listenWhenAuthed(
    `patrons/${patronId}/status`,
    (snap) => callback(snap.val()),
    () => callback(null),
  );

export const listenToPatronStatuses = (callback) =>
  listenWhenAuthed(
    "patrons",
    (snap) => {
      const statuses = {};
      Object.entries(snap.val() ?? {}).forEach(([id, patron]) => {
        if (patron?.status) statuses[id] = patron.status;
      });
      callback(statuses);
    },
    () => callback({}),
  );