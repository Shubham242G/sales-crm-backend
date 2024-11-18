// import mainlogo from "../../assets/mainlogo/logo.png";
// import hamburger from "../../assets/header/hamburger.webp";
// import { useSidebar } from "../../provider/SidebarContext";
// import { FaCirclePlus } from "react-icons/fa6";
// import { Link } from "react-router-dom";
// import { IoChevronDown } from "react-icons/io5";
// import { FaUserCircle } from "react-icons/fa";
// import userimg from "../../assets/header/userimg.webp";
// import { useState } from "react";
// import CreateCustomer from "../ReuseableComponents/Modals/CreateCustomer";
// function Header() {
//   const { showSlim, toggleSlim } = useSidebar();

//   const [loginDrop, setLoginDrop] = useState(false);

//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const handleOpenCreateModal = () => {
//     setShowCreateModal(true);
//   };

//   return (
//     <>
//       <header className="w-full h-full">
//         <div className="flex flex-row ">
//           <div className="w-full">
//             <div className="right_header flex justify-end shadow-lg bg-white px-5 py-4 h-full border-b border-white">

//               <div className="button_group flex gap-1">
//                 <Link
//                   to="/dashboard"
//                   className="bg-primarylight rounded-3xl uppercase font-medium  py-2 px-5 flex gap-2 items-center text-white hover:bg-buttnhover"
//                 >
//                   <FaCirclePlus className="text-lg" />
//                   New Sales
//                 </Link>
//                 <button
//                   type="button"
//                   onClick={handleOpenCreateModal}
//                   className="bg-primarylight rounded-3xl uppercase font-medium  py-2 px-5 flex gap-2 items-center text-white hover:bg-buttnhover"
//                 >
//                   <FaCirclePlus className="text-lg" />
//                   Customer
//                 </button>

//                 <div className="relative">
//                   <button
//                     type="button"
//                     onClick={() => setLoginDrop(!loginDrop)}
//                     className="bg-secondarycolor  rounded-3xl uppercase font-medium  py-2 px-4 flex gap-2 items-center text-white hover:bg-buttnhover"
//                   >
//                     <FaUserCircle className="text-3xl" />
//                     <IoChevronDown className="text-lg text-white" />
//                   </button>
//                   {loginDrop && (
//                     <div
//                       className={`w-[200px] min-h-[110px] bg-[#f9f9f9] border border-[#e3e3e3] dropdown_list ${
//                         loginDrop ? "show" : ""
//                       } shadow-xl  absolute -bottom-[115px] -left-28 `}
//                     >
//                       <ul className="flex  gap-[10px] border-b border-[#e3e3e3] p-3">
//                         <li>
//                           <img
//                             src={userimg}
//                             alt="userimg"
//                             className="w-[35px] h-[35px]"
//                           />
//                         </li>
//                         <li>
//                           <h6 className="text-secondarycolor font-semibold text-left">
//                             Name
//                           </h6>
//                           <p className="text-paracolor uppercase text-sm text-left">
//                             Admin Assistant
//                           </p>
//                         </li>
//                       </ul>
//                       <button
//                         onClick={() => setLoginDrop(false)}
//                         className="text-paracolor py-2 px-3 w-full text-left tracking-wide hover:bg-buttnhover hover:text-white "
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <CreateCustomer
//         showCreateModal={showCreateModal}
//         setShowCreateModal={setShowCreateModal}
//       />
//     </>
//   );
// }

// export default Header;

import mainlogo from "../../assets/mainlogo/logo.png";
import hamburger from "../../assets/header/hamburger.webp";
import { useSidebar } from "../../provider/SidebarContext";
import { Link } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";
import { FaUserCircle, FaBell } from "react-icons/fa";
import userimg from "../../assets/header/userimg.webp";
import { useState } from "react";
import CreateCustomer from "../ReuseableComponents/Modals/CreateCustomer";

function Header() {
  const { showSlim, toggleSlim } = useSidebar();
  const [loginDrop, setLoginDrop] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
                  className="text-secondarycolor flex items-center text-2xl hover:text-buttnhover"
                >
                  <FaBell />
                </button>

                {/* User Dropdown Button with Image and Name */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLoginDrop(!loginDrop)}
                    className="flex items-center gap-2 py-2 px-4 rounded-md font-medium text-black hover:bg-buttnhover"
                  >
                    <img
                      src={userimg}
                      alt="user profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-semibold">John Doe</span>
                    <IoChevronDown className="text-lg text-gray-500" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {loginDrop && (
                    <div
                      className="w-[200px] min-h-[110px] bg-[#f9f9f9] border border-[#e3e3e3] dropdown_list shadow-xl absolute -bottom-[115px] -left-28"
                    >
                      <ul className="flex gap-[10px] border-b border-[#e3e3e3] p-3">
                        <li>
                          <img
                            src={userimg}
                            alt="user profile"
                            className="w-[35px] h-[35px] rounded-full"
                          />
                        </li>
                        <li>
                          <h6 className="text-secondarycolor font-semibold text-left">
                            John Doe
                          </h6>
                          <p className="text-paracolor uppercase text-sm text-left">
                            Admin Assistant
                          </p>
                        </li>
                      </ul>
                      <button
                        onClick={() => setLoginDrop(false)}
                        className="text-paracolor py-2 px-3 w-full text-left tracking-wide hover:bg-buttnhover hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CreateCustomer
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
      />
    </>
  );
}

export default Header;
