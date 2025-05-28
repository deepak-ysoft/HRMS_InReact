import { BiGrid, BiEnvelope, BiIdCard, BiLogOut } from "react-icons/bi";
import { FaFileAlt, FaLaptop, FaUserEdit, FaUserTie } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { MdOutlinePersonPin } from "react-icons/md";
const SidebarItems = [
  {
    title: "Dashboard",
    icon: BiGrid,
    path: "dashboard",
  },
  {
    title: "Employee Management",
    icon: MdOutlinePersonPin,
    subItems: [
      { title: "Employee", path: "employees", icon: FaUserTie },
      { title: "Leave", path: "Leaves", icon: FaUserEdit },
      { title: "Assets", path: "Assets", icon: FaLaptop },
      { title: "Salary Slip", path: "salary-slip", icon: FaFileAlt },
      { title: "Document Management", path: "salary-slip", icon: FaFileAlt },
    ],
  },
  {
    title: "Profile",
    path: "/profile",
    icon: GoPerson,
  },
  {
    title: "Contact",
    path: "/contact",
    icon: BiEnvelope,
  },
  {
    title: "Candidate Management",
    path: "candidates",
    icon: BiIdCard,
  },
  {
    title: "Logout",
    path: "login",
    icon: BiLogOut,
  },
];

export default SidebarItems;
