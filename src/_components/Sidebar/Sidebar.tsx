import { useState } from "react";
import { MdChevronRight } from "react-icons/md";
import home from "../../assets/sidebar/home.webp";
import homew from "../../assets/sidebar/homew.webp";
import ledger from "../../assets/sidebar/ledger.png";
import transport from "../../assets/sidebar/transport.png";
import transportw from "../../assets/sidebar/transportw.png";
import ledgerw from "../../assets/sidebar/ledgerw.png";
import { useSidebar } from "../../provider/SidebarContext";
import { Link } from "react-router-dom";
import mainlogo from "../../assets/mainlogo/logo.png";

// import { IoChevronDown } from 'react-icons/io5'
function Sidebar() {
  // const [isHovered, setIsHovered] = useState(false);
  const [sidebarArr] = useState([
    {
      mainlink: "/dashboard",
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
      activeIcon: ledgerw,
      isActive: false,
      isArrow: false,
    },
    {
      mainlink: "/",
      heading: "Purchase",
      icon: ledger,
      activeIcon: ledgerw,
      isActive: false,
      isArrow: true,

      dropArr: [
        {
          dropHead: "Vendors",
          link: "vendorList",
        },
        {
          dropHead: "RFPS",
          link: "rfps",
        },
        {
          dropHead: "Quotes from Vendors",
          link: "quotesFromVendors",
        },
        {
          dropHead: "Confirmed Quotes",
          link: "confirmedQuotes",
        },
        {
          dropHead: "Purchase Contacts",
          link: "add-purchase-contact",
        },

      ],
    },

    {
      mainlink: "/",
      heading: "Sales",
      icon: ledger,
      activeIcon: ledgerw,
      isActive: false,
      isArrow: true,

      dropArr: [
        {
          dropHead: "Leads",
          link: "leads",
        },
        {
          dropHead: "Customers",
          link: "customer-sales",
        },
        {
          dropHead: "Quotes for Customer",
          link: "quotesForCustomer",
        },
        {
          dropHead: "Enquiry",
          link: "enquiryList",
        },

        {
          dropHead: "Confirmed Quotes",
          link: "confirmedQuotes",
        },
        {
          dropHead: "Invoices",
          link: "confirmedQuotes",
        },
        {
          dropHead: "Customer Outstanding",
          link: "confirmedQuotes",
        },
        {
          dropHead: "Sales Contacts",
          link: "sales-contact-view",
        },





      ],
    },
    // {
    //   mainlink: "/",
    //   heading: "Contact",
    //   icon: ledger,
    //   activeIcon: ledgerw,
    //   isActive: false,
    //   isArrow: true,

    //   dropArr: [
    //     {
    //       dropHead: "Contact",
    //       link: "contact",
    //     },


    //   ],
    // },
    {
      mainlink: "/DailyActivityReport",
      heading: "Daily Activity Report",
      icon: ledger,
      activeIcon: ledgerw,
      isActive: false,
      isArrow: true,
    },
    {
      mainlink: "/TaskManagement",
      heading: "Task Management",
      icon: ledger,
      activeIcon: ledgerw,
      isActive: false,
      isArrow: true,
    },
    {
      mainlink: "/Important",
      heading: "Important",
      icon: ledger,
      activeIcon: ledgerw,
      isActive: false,
      isArrow: true,

      dropArr: [
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








  ]);

  const [showdrop, setShowDrop] = useState<number | null>(null);

  const handleDropShow = (index: number) => {
    setShowDrop(showdrop === index ? null : index);
  };

  return (
    <>
      <div className="bg-[#0B2F46] h-full lg:h-[100vh] w-64 fixed">
        <div className="shadow-xl p-4">
          <img
            src={mainlogo}
            alt="mainlogo"
            className="object-contain w-[168px] h-[178px] mx-auto"
          />
        </div>
        <ul className="main-list w-full">
          {sidebarArr.map((el, index) => (
            <li className="relative" key={index}>
              {el.dropArr ? (
                <button
                  type="button"
                  className="flex items-center p-3 w-full bg-transparent hover:bg-orange-600 transition-colors justify-between"
                  onClick={() => handleDropShow(index)}
                >
                  <div className="icon w-6 h-6 mr-4 flex flex-row items-center gap-2">
                    <img
                      src={showdrop === index ? el.activeIcon : el.icon}
                      alt={el.heading}
                    />
                    <h6 className="text-sidebartext flex-1 group-hover:text-white">
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
                  to={el.mainlink}
                  className="flex items-center p-3 w-full bg-transparent hover:bg-orange-600 transition-colors"
                >
                  <div className="icon w-6 h-6 mr-4">
                    <img src={el.icon} alt={el.heading} />
                  </div>
                  <h6 className="text-sidebartext flex-1">{el.heading}</h6>
                </Link>
              )}

              {el.dropArr && showdrop === index && (
                <div className="dropdown_list max-h-40 overflow-y-auto">
                  <ul className="pl-6">
                    {el.dropArr.map((ele, idx) => (
                      <li key={idx} className="py-1">
                        <Link
                          to={ele.link}
                          className="text-sm text-sidebartext hover:text-sidebartexthover"
                        >
                          {ele.dropHead}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
