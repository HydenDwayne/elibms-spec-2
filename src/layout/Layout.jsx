import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className='font-roboto h-screen w-screen overflow-hidden flex bg-[#F4F0EE]'>
      <Sidebar />
      <Outlet />
    </div>
  );
}
