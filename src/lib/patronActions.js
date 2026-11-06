import { ref, update, onValue, serverTimestamp, runTransaction, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";

/* ---------- Writes ---------- */

const requireUser = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in to perform this action.");
  return user;
};

const patronRef = (patron) => {
  if (patron?.key === undefined || patron?.key === null) {
    throw new Error("Patron was not found in the database.");
  }
  return ref(db, `patrons/${patron.key}`);
};

export const suspendPatron = (patron) => {
  const user = requireUser();
  return update(patronRef(patron), {
    status: "Suspended",
    suspendedAt: serverTimestamp(),
    suspendedBy: user.uid,
  });
};

export const liftSuspension = (patron) => {
  const user = requireUser();
  return update(patronRef(patron), {
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

export const listenToPatrons = (callback) =>
  listenWhenAuthed(
    "patrons",
    (snap) => {

      const raw = snap.val() ?? {};

      const result = Object.entries(raw).map(([key, patron]) => ({
        ...patron,
        key,
      }));

      callback(result);
    },
    () => callback([]),
  );



export const registerPatron = async (data) => {
  const counterRef = ref(db, "counters/patrons");

  const result = await runTransaction(counterRef, (current) => (current || 0) + 1);
  const next = result.snapshot.val();

  const patronId = `PT-${String(next).padStart(4, "0")}`;

  await set(ref(db, `patrons/${patronId}`), {
    ...data,
    patronId,
    createdAt: serverTimestamp(),
  });
};