import { Outlet } from "react-router-dom";
import Header from "../_components/Header/Header";
import Sidebar from "../_components/Sidebar/Sidebar";
import { useSidebar } from "../provider/SidebarContext";

function Layout() {
  const { showSlim } = useSidebar();
  return (
    <div className="">
      <main>
        <div className="grid grid-cols-12">
          <div className="col-span-2">
            <Sidebar />
          </div>
          <div className="col-span-10  ">
            <div
              className=" shadow-md sticky top-0 z-10" >
               <Header    />
            </div>
             
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
