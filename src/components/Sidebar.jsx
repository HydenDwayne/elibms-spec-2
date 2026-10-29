import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import pfp from "../assets/default.webp"
import { 
  FiHome, 
  FiBook, 
  FiUsers, 
  FiMaximize, 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiBarChart2,
  FiLogOut,
  FiSettings
} from "react-icons/fi";

import data from "../data/dummy_data.json";

const links = [
  { to: "/", label: "Dashboard", icon: FiHome, end: true },
  // { to: "/books", label: "Books", icon: FiBook },
  { to: "/patrons", label: "Patrons", icon: FiUsers },
  { to: "/scan", label: "Scan a Book", icon: FiMaximize },
  { to: "/borrow", label: "Borrow a Book", icon: FiArrowUpRight },
  { to: "/return", label: "Return a Book", icon: FiArrowDownLeft },
  { to: "/reports", label: "Reports", icon: FiBarChart2 },
];


export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const linkSettingsClass = ({ isActive }) =>
    ` flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors w-50 ${
      isActive
        ? "bg-[#F5F5F5] text-gray-700 font-semibold"
        : "text-gray-300 hover:bg-slate-700 hover:text-white"
    }`;
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors w-50 ${
      isActive
        ? "bg-[#F5F5F5] text-gray-700 font-semibold"
        : "text-gray-300 hover:bg-slate-700 hover:text-white"
    }`;

    


  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-gradient-to-b from-slate-800 from-[40%] via-orange-900 via-[70%] to-orange-700 to-[95%] p-4 transition-transform duration-200
          md:static md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* <h1 className="px-3 pb-6 text-lg font-medium text-gray-200">ELIBMS</h1> */}

        <div className="pt-12 flex justify-center items-center flex-col">
            <img src={pfp} alt="profile_picture" className="bg-green-100 rounded-full w-25" />
            <p className="mt-2 font-semibold text-white text-xl mb-4">Hi, {data.users[0].displayName}!</p>
        </div>

        <nav className="flex flex-col items-center gap-1">
          {links.map(({ to, label, end, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClass}
              onClick={onClose}
            >
              <Icon className="text-lg shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-1">
          <NavLink
            to="/settings"
            className={linkSettingsClass}
            onClick={onClose}
          >
            <FiSettings className="text-lg shrink-0" />
            <span>Settings</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors w-50 text-gray-300 hover:bg-slate-700 hover:text-white"
          >
            <FiLogOut className="text-lg shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}
