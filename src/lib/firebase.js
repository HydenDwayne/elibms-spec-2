// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvamLEOJpq3wtTQgiTQhTrcfEosAgC9b8",
  authDomain: "elibms.firebaseapp.com",
  databaseURL: "https://elibms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "elibms",
  storageBucket: "elibms.firebasestorage.app",
  messagingSenderId: "830893408085",
  appId: "1:830893408085:web:4009c066a1754ba05f79dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const register = async (email, password) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  return response;
};

export const login = async (email, password) => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  return response;
};

export const googleSignIn = async () => {
  const response = await signInWithPopup(auth, provider);
  return response;
};

export const logout = async () => {
  const response = await signOut(auth);
  return response;
};