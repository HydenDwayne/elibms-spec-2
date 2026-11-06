import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// >>> KEEP YOUR OWN VALUES HERE (copy them from your current firebase.js) <<<
const firebaseConfig = {
  apiKey: "AIzaSyAvamLEOJpq3wtTQgiTQhTrcfEosAgC9b8",
  authDomain: "elibms.firebaseapp.com",
  databaseURL: "https://elibms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "elibms",
  storageBucket: "elibms.firebasestorage.app",
  messagingSenderId: "830893408085",
  appId: "1:830893408085:web:4009c066a1754ba05f79dc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export const register = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const googleSignIn = () => signInWithPopup(auth, googleProvider);

export const logout = () => signOut(auth);
