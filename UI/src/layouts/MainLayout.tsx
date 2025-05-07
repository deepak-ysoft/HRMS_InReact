import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/SideBar";

const MainLayout = () => {
  return (
    <div className="bg-base-200 min-h-screen">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-md bg-white">
        <Header />
      </header>

      {/* Main container with left padding for sidebar and top padding for header */}
      <div className="flex pt-[64px]">
        {/* Fixed Sidebar */}
        <aside className="fixed top-[64px] left-0 w-64 h-[calc(100vh-64px)] bg-base-100 shadow-md z-40">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-grow p-4">
          <Outlet /> {/* Nested routes will render here */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
