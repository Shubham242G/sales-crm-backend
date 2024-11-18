import { useEffect, useState } from "react";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaFileAlt, FaPlusCircle } from "react-icons/fa";
import Select from "react-select";
import { customReactStylesSmall1 } from "@/utils/ReactSelectStyle";
import { AiFillCloseSquare } from "react-icons/ai";
import { useLocation } from "react-router-dom";

export default function AddLedger() {
  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);
  const [isDisabled] = useState(false);
  const [isLoading] = useState(false);
  const [isRtl] = useState(false);

  const [customercode, setCustomerCode] = useState("CS-6815");
  const [primarycontact, setPrimaryContact] = useState("");
  const [companyname, setCompanyName] = useState("");
  const [customercallingno, setCustomerCallingNo] = useState("");
  const [aadharno, setAadharNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [customerremarks, setCustomerRemarks] = useState("");

  const [address, setAddress] = useState("");
  const [pincode, setPinCode] = useState("");
  const [creditlimit, setCreditLimit] = useState("");
  const [creditdays, setCreditDays] = useState("");
  const [discount, setDiscount] = useState("");
  const [statustype, setStatusType] = useState("");
  const [agenttype, setAgentType] = useState("");

  //  on click of agent add button

  const [agentcode, setAgentCode] = useState("");
  const [broker, setBroker] = useState("");
  const [commissionrate, setCommissionRate] = useState("");
  const [distance, setDistance] = useState("");
  const [contactperson, setContactPerson] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [phone1, setPhone1] = useState("");
  const [mobile1, setMobile1] = useState("");
  const [mobile2, setMobile2] = useState("");
  const [effectivedate, setEffectiveDate] = useState("");
  const [email, setEmail] = useState("");
  const [bank, setBank] = useState("");
  const [accountno, setAccountNo] = useState("");
  const [branch, setBranch] = useState("");
  const [ifsccode, setIFSCCode] = useState("");
  const [gstinno, setGSTINNo] = useState("");
  const [remark, setRemark] = useState("");

  const [status, setStatus] = useState("");

  // selected tab

  const [selectedTab, SetSelectedTab] = useState(0);

  const handlesetselectedTab = (index: any) => {
    SetSelectedTab(index);
  };

  const tabsArr = [
    {
      name: "Step-I",
      isActive: true,
    },
    {
      name: "Step-II",
      isActive: false,
    },
    {
      name: "Step-III",
      isActive: false,
    },
  ];

  const persontypeoptions: any = [
    {
      value: "Customers",
      label: "Customers",
    },
    {
      value: "M",
      label: "Puneet Ji",
    },
  ];
  const gsttypeoptions: any = [
    {
      value: "Registered",
      label: "Registered",
    },
    {
      value: "Unregistered",
      label: "Unregistered",
    },
  ];

  const billtypeoptions: any = [
    {
      value: "WS",
      label: "WS",
    },
    {
      value: "MRP",
      label: "MRP",
    },
  ];
  const agenttypeoptions: any = [
    {
      value: "WS",
      label: "WS",
    },
    {
      value: "MRP",
      label: "MRP",
    },
  ];

  const supplysourceoptions: any = [
    {
      value: "Delhi",
      label: "Delhi",
    },
    {
      value: "Haryana",
      label: "Haryana",
    },
  ];
  const transportoptions: any = [
    {
      value: "Manglam Express Cargo Private Limited",
      label: "Manglam Express Cargo Private Limited",
    },

    {
      value: "Krishna Cargo",
      label: "Krishna Cargo",
    },
  ];
  const transportmodeoptions: any = [
    {
      value: "Road",
      label: "Road",
    },
    {
      value: "Rail",
      label: "Rail",
    },
    {
      value: "Air",
      label: "Air",
    },
    {
      value: "Ship",
      label: "Ship",
    },
  ];

  const [addAgentAccountModal, setAddAgentAccountModal] = useState(false);

  const handleAddAgentModal = () => {
    setAddAgentAccountModal(true);
  };

  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  console.log("agenttypetypererer", agenttype);

  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    console.log("currentUrlcurrentUrlcurrentUrl", pathname);
  }, [pathname]);

  return (
    <>
      {/* <Breadcrumb pageTitle="Create Ledger Account"
        pageCategory="All Ledger"
        activePage="Create New Ledger"
        previouspageurl="/all-ledger"
        addbuttn={false}
        withLink={false}
        excelbuttn={false}
        filterbuttn={false}

      /> */}

      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
          <ul className="tabs flex justify-center gap-1 ">
            {tabsArr &&
              tabsArr.map((el: any, index: any) => (
                <li
                  key={index}
                  className={`${
                    index == 0
                      ? "w-1/3  bg-[#dedfd1] text-[#888]  rounded-t-md  rounded-r-none text-center"
                      : index == 2
                      ? "w-1/3  bg-[#dedfd1] text-[#888]  rounded-t-md  rounded-l-none text-center"
                      : "w-1/3  bg-[#dedfd1] text-[#888]  rounded-none  rounded-r-none text-center cursor-pointer"
                  }`}
                >
                  <button
                    type="button"
                    className={`${
                      selectedTab == index
                        ? "w-full rounded-t-md  rounded-r-none bg-black text-white hover:bg-black hover:text-white p-2"
                        : "w-full rounded-t-md  rounded-r-none hover:bg-black hover:text-white p-2"
                    }`}
                    onClick={() => SetSelectedTab(index)}
                  >
                    {el.name}
                  </button>
                </li>
              ))}
          </ul>

          {selectedTab == 0 ? (
            <>
              <div className="form_1 mb-3 mt-5 border-l-4 border-[#ddd] ps-3">
                <div className="flex items-baseline">
                  <h5 className="text-secondarycolor font-semibold text-lg mb-4 flex gap-1 items-center  ">
                    <FaFileAlt />

                    {pathname.includes("/update-ledger")
                      ? "Party Details"
                      : "Ledger Details"}
                  </h5>
                </div>

                <div className="form">
                  <div className="w-2/3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          {pathname.includes("/update-ledger")
                            ? "Membership"
                            : "Ledger Group"}
                        </label>
                      </div>

                      {pathname.includes("/update-ledger") ? (
                        <>
                          <div className="w-[74%]">
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              isDisabled={isDisabled}
                              isLoading={isLoading}
                              isClearable={isClearable}
                              isRtl={isRtl}
                              isSearchable={isSearchable}
                              name="color"
                              options={persontypeoptions}
                              styles={customReactStylesSmall1}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-[37%]">
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              isDisabled={isDisabled}
                              isLoading={isLoading}
                              isClearable={isClearable}
                              isRtl={isRtl}
                              isSearchable={isSearchable}
                              name="color"
                              options={persontypeoptions}
                              styles={customReactStylesSmall1}
                            />
                          </div>
                          <div className="w-[37%]">
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              isDisabled={isDisabled}
                              isLoading={isLoading}
                              isClearable={isClearable}
                              isRtl={isRtl}
                              isSearchable={isSearchable}
                              name="color"
                              options={persontypeoptions}
                              styles={customReactStylesSmall1}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Customer Code
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Customer Name"
                          onChange={(e) => setCustomerCode(e.target.value)}
                          value={customercode}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          GST Type
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name="color"
                          options={gsttypeoptions}
                          styles={customReactStylesSmall1}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Primary Contact
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Contact Person"
                          onChange={(e) => setPrimaryContact(e.target.value)}
                          value={primarycontact}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Company Name
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Company Name"
                          onChange={(e) => setCompanyName(e.target.value)}
                          value={companyname}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Customer Calling No
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Customer Calling No"
                          onChange={(e) => setCustomerCallingNo(e.target.value)}
                          value={customercallingno}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Aadhar No
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Aadhar No"
                          onChange={(e) => setAadharNo(e.target.value)}
                          value={aadharno}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Pan No
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Customer Calling No"
                          onChange={(e) => setPanNo(e.target.value)}
                          value={panNo}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Customer Remarks
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <textarea
                          rows={5}
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          placeholder="Customer Remarks"
                          onChange={(e) => setCustomerRemarks(e.target.value)}
                          value={customerremarks}
                        />
                      </div>
                    </div>

                    <div className="w-full flex justify-end mt-3 ">
                      <button
                        type="submit"
                        onClick={() => SetSelectedTab(1)}
                        className="bg-secondarycolor hover:bg-txtcolor w-[10%] text-white  py-[9px] text-text15 rounded-md "
                      >
                        Next{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : selectedTab == 1 ? (
            <>
              <div className="form_1 mb-3 mt-5 border-l-4 border-[#ddd] ps-3">
                <div className="flex items-baseline">
                  <h5 className="text-secondarycolor font-semibold text-lg mb-4 flex gap-1 items-center  ">
                    {" "}
                    <FaFileAlt /> Address Details
                  </h5>
                </div>

                <div className="form">
                  <div className="w-2/3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Address
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <textarea
                          rows={5}
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          placeholder="Enter Address"
                          onChange={(e) => setAddress(e.target.value)}
                          value={address}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          State
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name="color"
                          options={persontypeoptions}
                          styles={customReactStylesSmall1}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          City
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name="color"
                          options={persontypeoptions}
                          styles={customReactStylesSmall1}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Pincode
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Pincode"
                          onChange={(e) => setPinCode(e.target.value)}
                          value={pincode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form_1 mb-3 mt-5 border-l-4 border-[#ddd] ps-3">
                <div className="flex items-baseline">
                  <h5 className="text-secondarycolor font-semibold text-lg mb-4 flex gap-1 items-center  ">
                    {" "}
                    <FaFileAlt /> Pay Details
                  </h5>
                </div>

                <div className="form">
                  <div className="w-2/3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Credit Days
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Credit Days"
                          onChange={(e) => setCreditDays(e.target.value)}
                          value={creditdays}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Credit Limit
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Credit Limit"
                          onChange={(e) => setCreditLimit(e.target.value)}
                          value={creditlimit}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Item Rate Discount (%)
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Discount %"
                          onChange={(e) => setDiscount(e.target.value)}
                          value={discount}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Billing Type
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name="color"
                          options={billtypeoptions}
                          styles={customReactStylesSmall1}
                        />
                      </div>
                    </div>

                    <div className="w-full flex justify-end gap-2 mt-3 ">
                      <button
                        type="submit"
                        onClick={() => SetSelectedTab(0)}
                        className="bg-secondarycolor hover:bg-txtcolor w-[12%] text-white  py-[9px] text-text15 rounded-md "
                      >
                        Previous{" "}
                      </button>
                      <button
                        type="submit"
                        onClick={() => SetSelectedTab(2)}
                        className="bg-secondarycolor hover:bg-txtcolor w-[10%] text-white  py-[9px] text-text15 rounded-md "
                      >
                        Next{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : selectedTab == 2 ? (
            <>
              {pathname == "/update-ledger/status=true" && (
                <div className="form_1 mb-3 mt-5 border-l-4 border-[#ddd] ps-3">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-4 flex gap-1 items-center  ">
                      {" "}
                      <FaFileAlt /> Transport Details{" "}
                    </h5>
                  </div>

                  <div className="form">
                    <div className="w-2/3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1/4">
                          <label
                            className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                            htmlFor="grid-first-name"
                          >
                            Transport
                          </label>
                        </div>

                        <div className="w-[72%]">
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            isClearable={isClearable}
                            isRtl={isRtl}
                            isSearchable={isSearchable}
                            name="color"
                            options={transportoptions}
                            styles={customReactStylesSmall1}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddAgentModal}
                          className="w-[2%]"
                        >
                          <FaPlusCircle className="text-green-500" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1/4">
                          <label
                            className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                            htmlFor="grid-first-name"
                          >
                            Transport Mode
                          </label>
                        </div>

                        <div className="w-[74%]">
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            isClearable={isClearable}
                            isRtl={isRtl}
                            isSearchable={isSearchable}
                            name="color"
                            options={transportmodeoptions}
                            styles={customReactStylesSmall1}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1/4">
                          <label
                            className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                            htmlFor="grid-first-name"
                          >
                            Distance
                          </label>
                        </div>

                        <div className="w-[74%]">
                          <input
                            className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none "
                            id="grid-first-name"
                            type="text"
                            placeholder="Commission "
                            onChange={(e) => setDistance(e.target.value)}
                            value={distance}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="form_1 mb-3 mt-5 border-l-4 border-[#ddd] ps-3">
                <div className="flex items-baseline">
                  <h5 className="text-secondarycolor font-semibold text-lg mb-4 flex gap-1 items-center  ">
                    {" "}
                    <FaFileAlt /> Agent / Broker{" "}
                  </h5>
                </div>

                <div className="form">
                  <div className="w-2/3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Agent
                        </label>
                      </div>

                      <div className="w-[72%]">
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name="color"
                          onChange={(e: any) => setAgentType(e)}
                          options={agenttypeoptions}
                          styles={customReactStylesSmall1}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddAgentModal}
                        className="w-[2%]"
                      >
                        <FaPlusCircle className="text-green-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Commission (%)
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-3  mb-2 leading-tight focus:outline-none "
                          id="grid-first-name"
                          type="text"
                          placeholder="Commission "
                          onChange={(e) => setCreditDays(e.target.value)}
                          value={creditdays}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Sales Executive
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name="color"
                          options={billtypeoptions}
                          styles={customReactStylesSmall1}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Status
                        </label>
                      </div>

                      <div className="w-[74%]">
                        <select
                          name=""
                          id=""
                          value={statustype}
                          className="  text-sm font-normal block w-full  border border-[#dfdfdf] rounded p-3  mb-2 leading-tight focus:outline-none   "
                          onSelect={(e: any) => setStatusType(e.target.value)}
                        >
                          <option value="All Status">All Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Case">Case</option>
                        </select>
                      </div>
                    </div>

                    <div className="w-full flex justify-between  mt-5 ">
                      <button
                        type="submit"
                        onClick={() => SetSelectedTab(1)}
                        className="bg-secondarycolor hover:bg-txtcolor w-[10%] text-white  py-[9px] text-text15 rounded-md "
                      >
                        Previous{" "}
                      </button>
                      <button
                        type="submit"
                        onClick={() => SetSelectedTab(1)}
                        className="bg-red-500 hover:bg-txtcolor w-[12%] text-white  py-[9px] text-text15 rounded-md "
                      >
                        Create Account{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* on click of the 3rd step agent green plus button  */}

      <>
        {addAgentAccountModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setAddAgentAccountModal(!addAgentAccountModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[82vh] xl:w-[40rem] 3xl:w-[45rem]  top-[10%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">
                  Add Agent Account
                </h4>
                <button
                  type="button"
                  onClick={() => setAddAgentAccountModal(false)}
                >
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body py-3 ps-3 pe-4">
                <div className="form_1 mb-3 border-l-4 border-[#ddd] ps-3">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-2 flex items-center gap-2  ">
                      <FaFileAlt />
                      Personal Details
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Agent Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="AG-001"
                          onChange={(e) => setAgentCode(e.target.value)}
                          value={agentcode}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Broker <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={broker}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Broker Name"
                          onChange={(e) => setBroker(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Company Name
                        </label>
                        <input
                          value={companyname}
                          className="appearance-none  text-sm font-normal block w-full   border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Company"
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3  ">
                      <div className="w-full md:w-1/3 px-3 ">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Comm Rate %
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter Commission"
                          onChange={(e) => setCommissionRate(e.target.value)}
                          value={commissionrate}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3 ">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Contact Person <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter Name"
                          onChange={(e) => setContactPerson(e.target.value)}
                          value={contactperson}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3 ">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Address 1 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={address1}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          placeholder="Enter Address Line 1"
                          onChange={(e) => setAddress1(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Address 2 <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter Address Line 2"
                          onChange={(e) => setAddress2(e.target.value)}
                          value={address2}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Phone 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={phone1}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Broker Name"
                          onChange={(e) => setPhone1(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Mobile 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={mobile1}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Mobile No"
                          onChange={(e) => setMobile1(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Mobile 2
                        </label>
                        <input
                          value={mobile2}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Mobile No"
                          onChange={(e) => setMobile2(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter Email No."
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Effective Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={effectivedate}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="date"
                          placeholder="Enter Broker Name"
                          onChange={(e) => setEffectiveDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form_2 mb-3 border-l-4 border-[#ddd] ps-3">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-2 flex items-center gap-2  ">
                      <FaFileAlt />
                      Account Details
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Bank <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="AG-001"
                          onChange={(e) => setBank(e.target.value)}
                          value={bank}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Account No <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={accountno}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Account No"
                          onChange={(e) => setAccountNo(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Branch
                        </label>
                        <input
                          value={branch}
                          className="appearance-none  text-sm font-normal block w-full   border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Company"
                          onChange={(e) => setBranch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter IFSC Code"
                          onChange={(e) => setIFSCCode(e.target.value)}
                          value={ifsccode}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          GSTIN No <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={gstinno}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter GSTIN"
                          onChange={(e) => setGSTINNo(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Remark
                        </label>
                        <input
                          value={remark}
                          className="appearance-none  text-sm font-normal block w-full   border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Remark"
                          onChange={(e) => setRemark(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-medium text-sm mb-2"
                          htmlFor="grid-first-name"
                        >
                          Status
                        </label>
                        <select
                          onChange={(e) => setStatus(e.target.value)}
                          value={status}
                          name="cars"
                          id="cars"
                          className="  text-sm font-normal block w-full  border border-[#dfdfdf] rounded p-3  mb-2 leading-tight focus:outline-none  "
                          defaultValue="Select"
                        >
                          <option value="Select">Select</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="w-full md:w-1/3 px-3 flex gap-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="SendSMS" name="SendSMS" />
                          <label htmlFor="SendSMS" className="text-sm">
                            Send SMS
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="SendEmail"
                            name="SendEmail"
                          />
                          <label htmlFor="SendEmail" className="text-sm">
                            Send Email
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full  flex justify-end mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor"
                  >
                    Add Agent
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>
    </>
  );
}
