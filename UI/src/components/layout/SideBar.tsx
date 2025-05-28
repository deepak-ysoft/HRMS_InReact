import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import SidebarItems from "../../types/NavItem.types";
import { useLocation, Link } from "react-router-dom"; // Import Link from react-router-dom

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const location = useLocation();

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isOpen = (menuId: string) => openMenus.includes(menuId);
  const isActive = (path: string) => location.pathname === `/${path}`;

  return (
    <aside className="w-full lg:w-64 h-screen bg-base-100 p-4 shadow-lg">
      <ul className="space-y-2">
        {SidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={index}>
              {!item.subItems ? (
                <Link
                  to={`/${item.path}`} // Use Link component instead of <a>
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "hover:bg-base-300"
                  }`}
                >
                  {Icon && <Icon className="text-lg" />}
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-base-300 transition-all duration-200"
                  >
                    <span className="flex items-center gap-3">
                      {Icon && <Icon className="text-lg" />}
                      <span className="text-sm font-medium">{item.title}</span>
                    </span>
                    {isOpen(item.title) ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  <ul
                    className={`pl-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen(item.title) ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    {item.subItems.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon;
                      return (
                        <li key={subIndex}>
                          <Link
                            to={`/${subItem.path}`}
                            className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                              isActive(subItem.path)
                                ? "bg-primary text-white"
                                : "hover:bg-base-300"
                            }`}
                          >
                            {SubIcon && <SubIcon className="text-lg text-slate-500" />}
                            {subItem.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
