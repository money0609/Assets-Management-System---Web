import React from "react";
import { Outlet } from "react-router-dom";
import type { MainLayoutProps } from "./Mainlayout.types";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const MainLayout: React.FC<MainLayoutProps> = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </main>
        </div>
      </div>
    );
  };
  
  export default MainLayout;