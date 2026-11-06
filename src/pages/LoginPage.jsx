import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { auth } from "../lib/firebase";

const inputClass =
  "h-10 w-full rounded-sm border border-[#545F71] bg-white px-3 text-sm text-[#1D2937] outline-none transition-colors duration-200 focus:border-[#c96d45] disabled:opacity-60";

const authMessages = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Send the librarian back to the page they were trying to open
  const redirectTo = location.state?.from?.pathname || "/";

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(authMessages[err.code] || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-800 via-orange-900 to-orange-700 px-4">
      <Helmet>
        <title>ELIBMS | Login</title>
      </Helmet>

      <div className="w-full max-w-sm rounded-md bg-[#fdfdfd] p-8 shadow-xl">
        <h1 className="bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-2xl font-bold text-transparent">
          ELIBMS
        </h1>
        <p className="mb-6 mt-1 text-sm text-[#545F71]">Log in as Librarian</p>

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-[#545F71]">
              Email
            </label>
            <input
              id="email"
              className={inputClass}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-[#545F71]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                className={`${inputClass} pr-10`}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#53657a]"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-sm bg-gradient-to-r from-[#1D2937] to-[#53759D] text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#545F71]">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-[#c96d45] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}