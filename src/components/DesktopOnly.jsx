import { useEffect, useState } from "react";
import { FiMonitor } from "react-icons/fi";

// Laptops/desktops: a mouse or trackpad as the primary input, and a wide screen
const QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

const isMobileUA = () =>
  /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac, so detect it by touch support
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export default function DesktopOnly({ children }) {
  const [allowed, setAllowed] = useState(
    () => window.matchMedia(QUERY).matches && !isMobileUA()
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setAllowed(mq.matches && !isMobileUA());
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (allowed) return children;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-800 via-orange-900 to-orange-700 px-6 text-center">
      <FiMonitor className="mb-4 text-5xl text-gray-200" />
      <h1 className="mb-2 text-xl font-bold text-gray-100">
        Desktop or laptop required
      </h1>
      <p className="max-w-sm text-sm text-gray-300">
        ELIBMS is only available on laptops and desktop computers. Please open
        it on one of those devices, and make sure your browser window is wide
        enough.
      </p>
    </div>
  );
}