import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      const messages = {
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
      };
      setError(messages[err.code] || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-orange-900 to-orange-700 flex justify-center items-center flex-col">
      <h2 className="text-lg weight-500 pb-3 text-gray-300">
        Login as Librarian
      </h2>
      <form
        onSubmit={handleEmailLogin}
        className="flex flex-col justify-center items-center gap-4"
      >
        <div>
          <p className="text-gray-300 pl-3 pb-1 text-sm">Email</p>
          <input
            className="rounded-md px-2 border-1 border-gray-600 w-80 h-10 bg-gray-200"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="text-gray-300 pl-3 pb-1 text-sm">Password</p>
          <input
            className="rounded-md px-2 border-1 border-gray-600 w-80 h-10 bg-gray-200"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="w-30 rounded-md 2 bg-[#293949] w-80 h-10 text-gray-300"
          type="submit"
        >
          Log in
        </button>
      </form>
      <br />
      {error && <p className="text-red-500 pt-2">{error}</p>}
    </div>
  );
}
