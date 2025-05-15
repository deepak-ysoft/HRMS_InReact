import {
  BiGrid,
  BiEditAlt,
  BiEnvelope,
  BiIdCard,
  BiLogIn,
} from "react-icons/bi";
import { GoPerson } from "react-icons/go";

const SidebarItems = [
  {
    title: "Dashboard",
    icon: BiGrid,
    path: "dashboard",
  },
  {
    title: "Forms",
    icon: BiEditAlt,
    subItems: [
      { title: "Form Elements", path: "/forms/elements" },
      { title: "Form Layouts", path: "/forms/layouts" },
      { title: "Form Editors", path: "/forms/editors" },
      { title: "Form Validation", path: "/forms/validation" },
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
    title: "Register",
    path: "candidates/add-candidate",
    icon: BiIdCard,
  },
  {
    title: "Login",
    path: "login",
    icon: BiLogIn,
  },
];

export default SidebarItems;
