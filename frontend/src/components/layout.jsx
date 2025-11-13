import React from "react";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";
import "../styles/layout.css";

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
