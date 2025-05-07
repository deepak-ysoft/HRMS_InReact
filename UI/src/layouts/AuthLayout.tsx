import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200 text-base-content relative">
      {/* Header */}
      <div className="navbar bg-base-100">
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">AuthApp</a>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <button
        className="btn btn-ghost btn-circle absolute top-4 right-4 z-10"
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Switch to Dark Mode</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Switch to Light Mode</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.66-13.66l-.707.707M4.34 19.66l-.707-.707M21 12h-1M4 12H3m16.66 6.66l-.707-.707M4.34 4.34l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>

      {/* Main Content (centered) */}
      <main className="flex-grow flex items-center justify-center px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-4 text-center bg-base-200 text-base-content">
        &copy; 2025 AuthApp. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
