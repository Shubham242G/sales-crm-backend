import { useContext, useEffect, useState } from "react";

import CreateCustomer from "../ReuseableComponents/Modals/CreateCustomer";
import { AuthContext } from "@/context/AuthProvider";
import { getAuth } from "@/utils/auth";
import { useUserById } from "@/services/user.service";
import { useNotificationByUserId } from "@/services/notification.service";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { useSidebar } from "@/provider/SidebarContext";

function Header() {
  const { showSlim, toggleSlim } = useSidebar();
  const [loginDrop, setLoginDrop] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isAuthorized, setIsAuthorized } = useContext(AuthContext);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [userId, setUserId] = useState("");

 



  const handleNotification = () => {
    navigate("/notification");
    setNotificationCount(0);
  };

  const getUserId = async () => {
    const decodedToken = await getAuth();
    if (decodedToken?.token) {
      setUserId(decodedToken.userId);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  const { data: UserDataById } = useUserById(userId);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    setIsAuthorized(false);
    navigate("/");
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (UserDataById) {
      setFormData({
        name: UserDataById?.name || "",
        email: UserDataById?.email || "",
        role: UserDataById?.role || "",
      });
    }
  }, [UserDataById]);

  return (
    <>
      <header className="w-full h-full">
        <div className="flex flex-row">
          <div className="w-full">
            <div className="right_header flex justify-end shadow-lg bg-white px-5 py-4 h-full border-b border-white">
              <div className="button_group flex gap-4 items-center">
                {/* Notification Button */}
                <button
                  type="button"
                  className="text-secondarycolor flex items-center text-2xl relative"
                  onClick={handleNotification}
                >
                  {notificationCount > 0 && (
                    <p className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-[13px] h-[13px] flex justify-center items-center text-[12px]">
                      {notificationCount}
                    </p>
                  )}
                  <FaBell />
                </button>

                {/* User Dropdown Button with Name */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLoginDrop(!loginDrop)}
                    className="flex items-center gap-2 py-2 px-4 rounded-md font-medium text-black hover:bg-orange-500 hover:text-white"
                  >
                    <span className="text-sm font-semibold">{formData?.name}</span>
                    <IoChevronDown className="text-lg text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {loginDrop && (
                    // <div className="w-[200px] min-h-[110px] bg-[#f9f9f9] border z-10 border-[#e3e3e3] dropdown_list shadow-xl absolute -bottom-[115px] -left-28">
                    //   <ul className="flex gap-[10px] border-b border-[#e3e3e3] p-3">
                    //     <li>
                    //       <h6 className="text-secondarycolor font-semibold text-left">{formData?.name}</h6>
                    //       <p className="text-paracolor uppercase text-sm text-left">{formData?.email}</p>
                    //       <p className="text-paracolor uppercase text-sm text-left">{formData?.role}</p>
                    //     </li>
                    //   </ul>
                    //   <button
                    //     onClick={handleLogout}
                    //     className="text-paracolor py-2 px-3 w-full text-left tracking-wide hover:bg-buttnhover hover:text-white"
                    //   >
                    //     Logout
                    //   </button>
                    // </div>
                    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4 hover:shadow-xl z-10 -left-40  absolute transition-shadow duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 text-orange-500 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                        {formData?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{formData?.name}</h2>
                        <p className="text-sm text-gray-500">{formData?.email}</p>
                      </div>
                    </div>
              
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white bg-orange-500 px-3 py-1 rounded-full">
                        {formData?.role}
                      </span>
              
                      <button
                        onClick={handleLogout}
                        className="text-sm text-red-700 border border-red-500 px-3 py-1 rounded-full hover:bg-red-100 transition duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CreateCustomer showCreateModal={showCreateModal} setShowCreateModal={setShowCreateModal} />
    </>
  );
}

export default Header;
