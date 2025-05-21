import { BiGrid, BiEnvelope, BiIdCard, BiLogIn } from "react-icons/bi";
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
      { title: "Employee", path: "employees" },
      { title: "Leave", path: "Leaves" },
      { title: "Assets", path: "assets" },
      { title: "Salary Slip", path: "salary-slip" },
      { title: "Document Management", path: "salary-slip" },
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
    title: "Login",
    path: "login",
    icon: BiLogIn,
  },
];

export default SidebarItems;
