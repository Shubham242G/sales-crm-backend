import { useEffect, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import home from "../../assets/sidebar/home.png";
import homew from "../../assets/sidebar/homew.webp"
import ledger from "@/assets/slidericon/computer.png";
import cart from "../../assets/slidericon/cart.png";
import hierarchy from "../../assets/slidericon/hierarchy.png";
import important from "../../assets/slidericon/important.png";
import pricetag from "../../assets/slidericon/pricetag.png";
import search from "../../assets/slidericon/search.png";
import task from "../../assets/slidericon/task.png";
import transport from "../../assets/sidebar/transport.png";
import transportw from "../../assets/sidebar/transportw.png";
import ledgerw from "@/assets/sidebar/ledgerw.png";
import leadership from "../../assets/sidebar/leadership.png";
import { useSidebar } from "../../provider/SidebarContext";
import { Link } from "react-router-dom";
import mainlogo from "../../assets/mainlogo/favicon-9.png";
import logosm from "../../assets/header/360solutions_white_text_high_quality.png";
import report from "../../assets/sidebar/document.png";


import { getAuth } from "@/utils/auth";
import { useRolesById, useRolesByRole } from "@/services/roles.service";
import {
  checkPermissionsForButtons,
  CreateRoutePermission,
  RoutePermission,
} from "@/utils/permission";
import { AiFillCloseSquare } from "react-icons/ai";
import { FaBars } from "react-icons/fa";

function Sidebar() {



  const [sidebarArr] = useState([
    {
      mainlink: "/",
      heading: "Dashboard",
      icon: home,
      activeIcon: home,
      isActive: false,
      isArrow: false,
    },
    {
      mainlink: "/admin",
      heading: "Admin",
      icon: ledger,
      activeIcon: ledger,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "User",
          link: "users",
          plusLink: "/add-users",
        },
        {
          dropHead: "Roles",
          link: "roles",
          plusLink: "/add-role",
        },
      ],
    },
    {
      mainlink: "/",
      heading: "Purchase",
      icon: cart,
      activeIcon: cart,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "Vendors",
          link: "vendorList",
          plusLink: "/add-vendor",
        },
        {
          dropHead: "RFPS",
          link: "rfps",
          plusLink: "/add-rfps",
        },
        {
          dropHead: "Quotes from Vendors",
          link: "quotesFromVendors",
          plusLink: "/addQuotesFromVendors",
        },
        {
          dropHead: "Confirmed Quotes From Vendors",
          link: "confirmedQuotes",
          plusLink: "/add-ConfirmedQuotesFromVendor",
        },
      ],
    },
    // {
    //   mainlink: "/",
    //   heading: "Hierarchy",
    //   icon: hierarchy,
    //   activeIcon: hierarchy,
    //   isActive: false,
    //   isArrow: true,
    //   dropArr: [
    //     {
    //       dropHead: "Roles",
    //       link: "roleHierarchy",
    //       plusLink: "/roleHierarchy",
    //     },
    //     {
    //       dropHead: "role Modal",
    //       link: "roleModal",
    //       plusLink: "/newRoleModal",
    //     },
    //   ],
    // },
    {
      mainlink: "/",
      heading: "Sales",
      icon: pricetag,
      activeIcon: pricetag,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "Leads",
          link: "leads",
          plusLink: "/add-leads",
        },
        {
          dropHead: "Customers",
          link: "customer-sales",
          plusLink: "/add-customer",
        },
        {
          dropHead: "Quotes for Customer",
          link: "quotesForCustomer",
          plusLink: "/quotesForCustomerView",
        },
        {
          dropHead: "Enquiry",
          link: "enquiryList",
          plusLink: "/addEnquiry",
        },
        {
          dropHead: "Confirmed Quotes Customer",
          link: "/confirmedQuotesToCustomer",

        },
        {
          dropHead: "Invoices",
          link: "/zohoInvoice",
        },
        {
          dropHead: "Vendor Purchase Bill",
          link: "/vendorPurchaseBill",
        },
        {
          dropHead: "Customer Outstanding",
          link: "confirmedQuotes",
        },
      ],
    },
    {
      mainlink: "/DailyActivityReport",
      heading: "Daily Activity Report",
      icon: report,
      activeIcon: report,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "Daily Activity Report View",
          link: "DailyActivityReport",
          plusLink: "/DailyActivityReport",
        },
        {
          dropHead: "Monthly Planner",
          link: "monthlyPlanner",
          plusLink: "/monthlyPlanner",
        },
      ],
    },
    {
      mainlink: "/hotelSearch",
      heading: "Hotel Search",
      icon: search,
      activeIcon: search,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "Venue Search",
          link: "venueSearch",
          plusLink: "/venueSearch",
        },
      ],
    },

    {
      mainlink: "/LeadManagement",
      heading: "Lead Management",
      icon: leadership,
      activeIcon: leadership,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "Lead Management",
          link: "leadManagement",
          plusLink: "/leadManagement",
        },
      ],
    },
    {
      mainlink: "/TaskManagement",
      heading: "Task Management",
      icon: task,
      activeIcon: task,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "Task",
          link: "taskManagement",
          plusLink: "/add-TaskManagement",
        },
        {
          dropHead: "My Tasks",
          link: "MyTask",
          plusLink: "/add-TaskManagement",
        },
        {
          dropHead: "Task Management",
          link: "TaskManagement",
          plusLink: "/TaskManagement",
        },
      ],
    },
    {
      mainlink: "/Important",
      heading: "Important",
      icon: important,
      activeIcon: important,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "Add Department",
          link: "departmentMasterView",
        },
        {
          dropHead: "Add Category",
          link: "CategoryList",
        },
        {
          dropHead: "Add Hotel",
          link: "HotelList",
        },
        {
          dropHead: "Add Banquet",
          link: "BanquetList",
        },
        {
          dropHead: "Add Restaurant",
          link: "ResturantList",
        },
      ],
    },
    //   {
    //     mainlink: "/zohoInvoice",
    //     heading: "zohoInvoice",
    //     icon: ledger,
    //     activeIcon: ledgerw,
    //     isActive: false,
    //     isArrow: true,
    //     dropArr: [
    //       {
    //         dropHead: "Zoho Invoice",
    //         link: "zohoInvoice",
    //       },

    //     ],
    //   }

  ]);

  const [showMenu, setShowMenu] = useState(false);
  const [showdrop, setShowDrop] = useState(null);

  const handleDropShow = (index: any) => {
    setShowDrop(showdrop === index ? null : index);
  };
  const filteredSidebarArr = sidebarArr
    .map((item) => {
      if (item.heading === "Dashboard") return item;

      let filteredDropArr = item.dropArr
        ? item.dropArr.filter((dropItem) => RoutePermission(dropItem.dropHead))
        : null;

      const hasMainPermission = RoutePermission(item.heading);
      const hasValidDropItems = filteredDropArr && filteredDropArr.length > 0;

      return hasMainPermission || hasValidDropItems
        ? { ...item, dropArr: filteredDropArr }
        : null;
    })
    .filter(Boolean);

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
 
      <div className={` lg:flex lg:flex-col lg:h-full lg:bg-[#f7f8ff] lg:border-r-2 lg:top-0 lg:left-0 lg:z-10 transition-all duration-2`}>
        <div className="mt-16  items-center  w-full h-[120px] flex justify-center">
          <img
            src={mainlogo}
            alt="mainlogo"
            className="mx-auto max-w-[120px] max-h-[120px] w-full h-full"
          />
        </div>
<div><ul className="main-list w-full overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 h-[100vh] mt-2">
          {filteredSidebarArr.map((el, index) => (
            <li className="relative mt-4 -mb-2 ml-2 text-sm" key={index}>
              {el?.dropArr ? (
                <button
                  type="button"
                  className="flex text-gray-850 items-center p-3 w-full bg-transparent hover:bg-orange-400 hover:text-white hover:rounded-lg transition-colors justify-between"
                  onClick={() => handleDropShow(index)}
                >
                  <div className="icon w-5 h-3 mr-4   flex flex-row items-center gap-2">
                    <img
                      src={showdrop === index ? el.activeIcon : el.icon}
                      alt={el.heading}
                    />
                    <h6 className="flex-1 group-hover:text-white ml-1 whitespace-nowrap">
                      {el.heading}
                    </h6>
                  </div>
                  <MdChevronRight
                    className={`transition-transform ${showdrop === index ? "rotate-90" : ""
                      }`}
                  />
                </button>
              ) : (
                <Link
                  to={el?.mainlink ? el.mainlink : ""}
                  className="flex items-center p-3 w-full  bg-transparent hover:bg-orange-400 hover:text-white hover:rounded-lg transition-colors"
                >
                  <div className="icon w-5 h-3 mr-2">
                    <img src={el?.icon} alt={el?.heading} />
                  </div>
                  <h6 className="flex-1 whitespace-nowrap ml-1 -mb-2">
                    {el?.heading}
                  </h6>
                </Link>
              )}

              {el?.dropArr && showdrop === index && (
                <div className="dropdown_list max-h-40 ml-6 overflow-y-auto">
                  <ul className="pl-6">
                    {el.dropArr.map((ele, idx) => (
                      <li key={idx} className="py-1">
                        <div className="flex justify-between items-center group">
                          {ele && (
                            <>
                              <Link
                                to={ele.link}
                                className="text-sm text-grey-850 hover:text-orange-500 hover:rounded-lg "
                              >
                                {ele.dropHead}
                              </Link>
                              {ele.plusLink && (
                                <Link
                                  to={ele.plusLink}
                                  className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                >
                                  <span className="bg-white rounded-full w-5 h-5 -ml-5 flex items-center justify-center text-xs font-medium leading-none">
                                    +
                                  </span>
                                </Link>
                              )}
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul></div>
        
      </div>
    </>
  );
}

export default Sidebar;