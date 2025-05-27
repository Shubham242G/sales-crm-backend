import { Outlet } from "react-router-dom";
import Header from "../_components/Header/Header";
import Sidebar from "../_components/Sidebar/Sidebar";
import { useSidebar } from "../provider/SidebarContext";

function Layout() {
  const { showSlim } = useSidebar();
  return (
    <div className="">
      <main>
        <div className="flex flex-col md:flex-row w-[100%] h-[100vh]">
          <div className="w-[15%]">
            <Sidebar />
          </div>
          <div className="md:w-[85%] w-3/4 lg:w-[85%] flex flex-col">
            <div className=" sticky w-[100%] top-0 z-10">
              <Header />
               <Outlet />
            </div> 
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
