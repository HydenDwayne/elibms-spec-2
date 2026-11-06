import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, set, update } from "firebase/database";
import { auth, db } from "../lib/firebase";
import data from "../data/dummy_data.json";

const LibrarianContext = createContext(null);

export function LibrarianProvider({ children }) {
  const [librarian, setLibrarian] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let stopListening = () => {};

    const stopAuth = onAuthStateChanged(auth, (user) => {
      stopListening();
      if (!user) {
        setLibrarian(null);
        setError("");
        return;
      }

      const userRef = ref(db, `librarians/${user.uid}`);
      stopListening = onValue(
        userRef,
        (snap) => {
          setError("");
          if (snap.exists()) {
            setLibrarian({ id: user.uid, ...snap.val() });
          } else {
            // First login: create the profile from the dummy data
            const { id, avatar, ...seed } = data.users[0];
            set(userRef, { ...seed, email: user.email, avatar: null }).catch(
              (err) => {
                console.error("Couldn't create librarian profile:", err);
                setError(err.message);
              }
            );
          }
        },
        (err) => {
          console.error("Couldn't load librarian profile:", err);
          setError(err.message);
        }
      );
    });

    return () => {
      stopListening();
      stopAuth();
    };
  }, []);

  const updateLibrarian = useCallback(async (patch) => {
    const user = auth.currentUser;
    if (!user) throw new Error("You're not logged in.");
    await update(ref(db, `librarians/${user.uid}`), patch);
  }, []);

  return (
    <LibrarianContext.Provider value={{ librarian, updateLibrarian, error }}>
      {children}
    </LibrarianContext.Provider>
  );
}

export const useLibrarian = () => useContext(LibrarianContext);
