import React from "react";
import { BiLogOut } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineChangeCircle } from "react-icons/md";

interface Props {
  user: string;
  onProfile: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<Props> = ({
  user,
  onProfile,
  onChangePassword,
  onLogout,
}) => {
  return (
    <div className="absolute right-0 top-12 mt-2 w-48 bg-base-100 shadow-lg rounded-md z-50 border">
      <div className="px-4 py-2 border-b">
        <h3 className="text-lg font-semibold text-base-800">{user}</h3>
      </div>
      <ul className="py-2 text-sm text-base-700">
        <li>
          <button
            onClick={onProfile}
            className="flex gap-2 w-full text-left px-4 py-2 hover:bg-base-200"
          >
            <FaRegUserCircle className="mt-1" /> Profile
          </button>
        </li>
        <li>
          <button
            onClick={onChangePassword}
            className="flex gap-2 w-full text-left px-4 py-2 hover:bg-base-200"
          >
            <MdOutlineChangeCircle className="mt-1" /> Change Password
          </button>
        </li>
        <li>
          <button
            onClick={onLogout}
            className="flex gap-2 w-full text-left px-4 py-2 hover:bg-base-200 text-red-500"
          >
            <BiLogOut className="mt-1" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;

//   {
//     title: "Logout",
//     path: "login",
//     icon: BiLogOut,
//   },
