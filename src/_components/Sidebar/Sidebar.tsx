import { useEffect, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import home from "../../assets/sidebar/home.webp";
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
import { useSidebar } from "../../provider/SidebarContext";
import { Link } from "react-router-dom";
import mainlogo from "../../assets/mainlogo/favicon-9.png";
import { getAuth } from "@/utils/auth";
import { useRolesById, useRolesByRole } from "@/services/roles.service";
import {
  checkPermissionsForButtons,
  CreateRoutePermission,
  RoutePermission,
} from "@/utils/permission";

function Sidebar() {
  const [sidebarArr] = useState([
    {
      mainlink: "/",
      heading: "Dashboard",
      icon: home,
      activeIcon: homew,
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
          dropHead: "Confirmed Quotes",
          link: "confirmedQuotes",
        },
      ],
    },
    {
      mainlink: "/",
      heading: "Hierarchy",
      icon: hierarchy,
      activeIcon: hierarchy,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "Roles",
          link: "roleHierarchy",
          plusLink: "/roleHierarchy",
        },
        {
          dropHead: "role Modal",
          link: "roleModal",
          plusLink: "/newRoleModal",
        },
      ],
    },
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
          dropHead: "Confirmed Quotes",
          link: "/confirmedQuotesToCustomer",
        },
        {
          dropHead: "Invoices",
          link: "confirmedQuotes",
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
      icon: ledger,
      activeIcon: ledgerw,
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
          dropHead: "Add Resturant",
          link: "ResturantList",
        },
      ],
    },
    {
      mainlink: "/zohoInvoice",
      heading: "zohoInvoice",
      icon: ledger,
      activeIcon: ledgerw,
      isActive: false,
      isArrow: true,
      dropArr: [
        {
          dropHead: "Zoho Invoice",
          link: "zohoInvoice",
        },

      ],
    }
  ]);

  const [showdrop, setShowDrop] = useState(null);

  const handleDropShow = (index: any) => {
    setShowDrop(showdrop === index ? null : index);
  };

  const filteredSidebarArr = sidebarArr
    .map((item) => {
      let filteredDropArr = item.dropArr
        ? item.dropArr
          .map((dropItem) => {
            let response = CreateRoutePermission(dropItem.dropHead, dropItem);
            if (response.view) {
              dropItem.plusLink = response.create ? dropItem.plusLink : "";
              return dropItem;
            }
            return null;
          })
          .filter(Boolean)
        : null;


      const hasMainPermission =
        item.heading === "Dashboard" ? true : RoutePermission(item.heading);
      const hasValidDropItems = filteredDropArr && filteredDropArr.length > 0;

      return hasMainPermission || hasValidDropItems
        ? { ...item, dropArr: filteredDropArr }
        : null;
    })
    .filter(Boolean);



  return (
    <div className=" text-gray-850 bg-[#f7f8ff] h-full lg:h-[100vh] w-64 fixed overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-[#0B2F46]">
      <div className="shadow-xl p-4">
        <img
          src={mainlogo}
          alt="mainlogo"
          className="object-contain w-[168px] h-[178px] mx-auto"
        />
      </div>
      <ul className="main-list w-full overflow-auto h-[100vh]">
        {filteredSidebarArr.map((el, index) => (
          <li className="relative mt-4" key={index}>
            {el?.dropArr ? (
              <button
                type="button"
                className="flex text-gray-850 items-center p-3 w-full bg-transparent hover:bg-orange-400 hover:text-white hover:rounded-lg transition-colors justify-between"
                onClick={() => handleDropShow(index)}
              >
                <div className="icon w-6 h-2 mr-4 flex flex-row items-center gap-2">
                  <img
                    src={showdrop === index ? el.activeIcon : el.icon}
                    alt={el.heading}
                  />
                  <h6 className=" flex-1 group-hover:text-white whitespace-nowrap">
                    {el.heading}
                  </h6>
                </div>
                <MdChevronRight
                  className={`transition-transform ${showdrop === index ? "rotate-90" : ""}`}
                />
              </button>
            ) : (
              <Link
                to={el?.mainlink ? el.mainlink : ""}
                className="flex items-center p-3 w-full bg-transparent hover:bg-orange-400 hover:text-white hover:rounded-lg transition-colors"
              >
                <div className="icon w-6 h-6 mr-2">
                  <img src={el?.icon} alt={el?.heading} />
                </div>
                <h6 className=" flex-1 whitespace-nowrap">
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
                              className=" text-sm text-grey-850 hover:text-orange-500 hover:rounded-lg "
                            >
                              {ele.dropHead}
                            </Link>
                            {ele.plusLink && (
                              <Link
                                to={ele.plusLink}
                                className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <span className="bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium leading-none">
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
      </ul>
    </div>
  );
}

export default Sidebar;