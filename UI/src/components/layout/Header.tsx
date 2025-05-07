import React from "react";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

interface HeaderProps {
  appName?: string;
}

const Header: React.FC<HeaderProps> = ({ appName = "MyApp" }) => {
  return (
    <div className="navbar bg-base-100 ">
      {/* Left: Dropdown */}
      <div className="navbar-start">{/* <DropdownMenu /> */}</div>

      {/* Center: App Name */}
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">{appName}</a>
      </div>

      {/* Right: Icons */}
      <div className="navbar-end space-x-2">
        {/* Search */}
        <SearchBar />

        {/* Notifications */}
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Notifications</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
