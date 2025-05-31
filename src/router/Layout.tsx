import { Outlet } from "react-router-dom";
import Header from "../_components/Header/Header";
import Sidebar from "../_components/Sidebar/Sidebar";
import { useSidebar } from "../provider/SidebarContext";

function Layout() {
  const { showSlim } = useSidebar();
  return (
   <div className="min-h-screen bg-gray-50">
  <main>
    <Header />

    <div className="flex flex-col md:flex-row w-full">
      {/* Sidebar */}
      <div className="md:w-[15%] w-full z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="md:w-[85%] w-full flex flex-col">
        <div className="w-full z-10">
          <Outlet />
        </div>
      </div>
    </div>
  </main>
</div>

  );
}

export default Layout;
