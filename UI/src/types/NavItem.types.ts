import { BiGrid, BiEnvelope, BiIdCard } from "react-icons/bi";
import { FaLaptop, FaUserEdit, FaUserTie } from "react-icons/fa";
import { MdOutlinePersonPin } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { RiUserSearchLine } from "react-icons/ri";
import { LuUserPen } from "react-icons/lu";
import { LuCalendarSync } from "react-icons/lu";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { BiCalendarEvent } from "react-icons/bi";
const SidebarItems = [
  {
    title: "Dashboard",
    icon: BiGrid,
    path: "dashboard",
  },
  {
    title: "Candidate Management",
    icon: BiIdCard,
    subItems: [
      { title: "Interview", path: "interview", icon: RiUserSearchLine },
      { title: "Candidates", path: "candidates", icon: FiUsers },
    ],
  },
  {
    title: "Employee Management",
    icon: MdOutlinePersonPin,
    subItems: [
      { title: "Employee", path: "employees", icon: FaUserTie },
      { title: "Leave", path: "Leaves", icon: FaUserEdit },
      { title: "Assets", path: "Assets", icon: FaLaptop },
    ],
  },
  {
    title: "Calendar Management",
    icon: LuCalendarSync,
    subItems: [
      { title: "Calendar", path: "Calendar", icon: MdOutlineCalendarMonth },
      { title: "Events", path: "Events", icon: BiCalendarEvent },
    ],
  },
  {
    title: "Leads",
    path: "Leads",
    icon: LuUserPen,
  },
  {
    title: "Contact",
    path: "/contact",
    icon: BiEnvelope,
  },
  {
    title: "Attendance",
    path: "Attendance",
    icon: BiEnvelope,
  },
  {
    title: "EmployeeDocument",
    path: "EmployeeDocument",
    icon: BiEnvelope,
  },
  {
    title: "PerformanceReview",
    path: "PerformanceReview",
    icon: BiEnvelope,
  },
];

export default SidebarItems;
