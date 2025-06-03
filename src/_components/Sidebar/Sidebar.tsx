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
          dropHead: "Confirmed Quotes To Customer",
           link: "confirmedQuotesToCustomer",
          plusLink: "/add-ConfirmedQuotesFromVendor",

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
          plusLink: "/add-ConfirmedQuotesFromVendor",
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
          plusLink: "/departmentMaster",
        },
        {
          dropHead: "Add Category",
          link: "CategoryList",
          plusLink: "/category2",
        },
        {
          dropHead: "Add Hotel",
          link: "HotelList",
          plusLink: "/hotel",
        },
        {
          dropHead: "Add Banquet",
          link: "BanquetList",
          plusLink: "/banquet",
        },
        {
          dropHead: "Add Restaurant",
          link: "ResturantList",
          plusLink: "/ResturantList",
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
<div className="lg:flex lg:flex-col lg:h-full mb-10 lg:bg-[#f7f8ff] lg:border-r lg:top-0 lg:left-0 lg:z-10 transition-all duration-300 ease-in-out">
  {/* Logo Section */}
  <div className="mt-16 flex items-center justify-center h-[120px] shrink-0">
    <img
      src={mainlogo}
      alt="Main Logo"
      className="w-[100px] h-[100px] object-contain"
    />
  </div>

  {/* Sidebar List */}
  <ul className="main-list flex-1 overflow-y-auto  max-h-[calc(90vh-140px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-2 pr-2 mb-10">
    {filteredSidebarArr.map((el, index) => (
      <li className="relative mt-2 ml-3 text-sm" key={index}>
        {el?.dropArr ? (
          <button
            type="button"
            className="flex items-center justify-between w-full p-2.5 text-gray-800 hover:bg-orange-400 hover:text-white rounded-md transition-colors"
            onClick={() => handleDropShow(index)}
          >
            <div className="flex items-center gap-2">
              <img
                src={showdrop === index ? el.activeIcon : el.icon}
                alt={el.heading}
                className="w-5 h-5"
              />
              <span className="whitespace-nowrap">{el.heading}</span>
            </div>
            <MdChevronRight
              className={`transform transition-transform duration-200 ${showdrop === index ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <Link
            to={el?.mainlink || ""}
            className="flex items-center gap-2 p-2.5 w-full text-gray-800 hover:bg-orange-400 hover:text-white rounded-md transition-colors"
          >
            <img src={el?.icon} alt={el?.heading} className="w-5 h-5" />
            <span className="whitespace-nowrap">{el?.heading}</span>
          </Link>
        )}

        {/* Dropdown */}
        {el?.dropArr && showdrop === index && (
          <ul className="ml-8 mt-1 space-y-1 max-h-48 overflow-y-auto transition-all duration-200 pr-1">
            {el.dropArr.map((ele, idx) => (
              <li key={idx} className="flex justify-between items-center group">
                <Link
                  to={ele.link}
                  className="text-sm text-gray-700 hover:text-orange-500 transition-colors"
                >
                  {ele.dropHead}
                </Link>
                {ele.plusLink && (
                  <Link
                    to={ele.plusLink}
                    className="ml-2 p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <span className="bg-white w-5 h-5 flex items-center justify-center text-xs font-medium rounded-full border">
                      +
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
</div>

    </>
  );
}

export default Sidebar;