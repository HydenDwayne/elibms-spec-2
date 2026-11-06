import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiHome } from "react-icons/fi";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#1D2937] via-[#A35139] to-[#F6A85E] px-6 text-center">
      <p
        aria-hidden="true"
        className="select-none text-[140px] font-extrabold leading-none tracking-tight text-white/90 sm:text-[180px]"
      >
        404
      </p>

      <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
        The page you are looking for doesn&apos;t exist, was moved, or you
        may have typed the address incorrectly.
      </p>

      <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-sm border border-white/80 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/15"
        >
          <IoMdArrowRoundBack className="text-lg" />
          Go Back
        </button>

        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-sm bg-white text-sm font-semibold text-[#1D2937] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
        >
          <FiHome className="text-base" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;