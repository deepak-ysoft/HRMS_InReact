import React, { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import UserDropdown from "./UserDropdown"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import { EmployeeDetailsQuery } from "../../services/Employee Management/Employee/EmployeeDetailsQuery";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  appName?: string;
}

const Header: React.FC<HeaderProps> = ({ appName = "MyApp" }) => {
  const user = JSON.parse(localStorage.getItem("User") || "{}");
  const apiPath = import.meta.env.VITE_API_BASE_URL;
  const navigation = useNavigate();

  const { data } = useQuery({
    queryKey: ["employeeDetails", user.empId],
    queryFn: () => EmployeeDetailsQuery(user.empId),
    enabled: !!user?.empId,
  });

  console.log(user);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleProfile = () => {
    setShowDropdown(false);
    navigation(`/employees/EmployeeDetails`, { state: data?.data });
  };

  const handleChangePassword = () => {
    setShowDropdown(false);
    navigation("/change-password");
  };

  const handleLogout = () => {
    navigation("/login");
    localStorage.clear();
    setShowDropdown(false);
  };

  return (
    <div className="navbar bg-base-100">
      {/* Left */}
      <div className="navbar-start"></div>

      {/* Center */}
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">{appName}</a>
      </div>

      {/* Right */}
      <div className="navbar-end space-x-2 relative" ref={dropdownRef}>
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

        {/* Avatar + Dropdown */}
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="avatar">
            <div className="w-10 rounded-full text-white pt-[2px] bg-[rgb(159,145,251)] flex items-center justify-center">
              {data?.data?.imagePath ? (
                <img src={apiPath + data?.data.imagePath} alt="User Avatar" />
              ) : (
                <span className="text-2xl font-semibold">
                  {data?.data?.empName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </button>

        {showDropdown && (
          <UserDropdown
            user={data?.data?.empName || "User"}
            onProfile={handleProfile}
            onChangePassword={handleChangePassword}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
