import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { RiDeleteBin5Line } from "react-icons/ri";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
// import { toastError } from "../../utils/TOAST";
// import { FaFileAlt } from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import Select from "react-select";
import { customReactStylesSmall } from "../../utils/ReactSelectStyle";

export default function Transport() {
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);
  const [isDisabled] = useState(false);
  const [isLoading] = useState(false);
  const [isRtl] = useState(false);

  const [registered, setRegistered] = useState("RegisteredBusiness");
  const [gstinno, setGSTINNo] = useState("");
  const [transportname, setTransportName] = useState("");
  const [ownername, setOwnerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [alternatemobile, setAlternateMobile] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [panno, setPanNo] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [pincode, setPincode] = useState("");
  const [bank, setBank] = useState("");
  const [accountno, setAccountNo] = useState("");
  const [branch, setBranch] = useState("");
  const [ifsccode, setIFSCCode] = useState("");
  const [status, setStatus] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  const columns = [
    {
      name: "Company Name",
      cell: (row: any) => (
        <div className="flex flex-col  gap-1">
          <Link to="/dashboard" className="text-blue-400">
            {row.companylink}
          </Link>
          <div className="">{row.companyid}</div>
        </div>
      ),
      width: "25%",
    },
    {
      name: "Owner Name",
      selector: (row: any) => row.ownername,
      width: "25%",
    },

    {
      name: "City",
      selector: (row: any) => row.city,
      width: "15%",
    },
    {
      name: "Mobile",
      selector: (row: any) => row.mobile,
      width: "15%",
    },

    {
      name: "Intransit",
      selector: (row: any) => row.intransit,
      width: "5%",
    },
    {
      name: "Received",
      selector: (row: any) => row.received,
      width: "5%",
    },

    {
      name: "Action",
      width: "10%",
      selector: () => (
        <div className="flex items-center gap-3">
          <button className="text-blue-400 text-lg">
            <FiEdit />
          </button>
          <button className="text-red-500 text-lg">
            <RiDeleteBin5Line />
          </button>
        </div>
      ),
    },
  ];

  // Sample data
  const data = [
    {
      code: "002",
      companylink: "MANIMAHESH TRANSPORT COMPANY",
      companyid: "09JFBPK9902Q1ZL",
      ownername: "ANSHUL KASHYAP",
      city: "Ghaziabad",
      mobile: "9968237063",
      intransit: "0",
      received: "0",
    },
    {
      code: "002",
      companylink: "MANIMAHESH TRANSPORT COMPANY",
      companyid: "09JFBPK9902Q1ZL",
      ownername: "ANSHUL KASHYAP",
      city: "Ghaziabad",
      mobile: "9968237063",
      intransit: "0",
      received: "0",
    },
    {
      code: "002",
      companylink: "MANIMAHESH TRANSPORT COMPANY",
      companyid: "09JFBPK9902Q1ZL",
      ownername: "ANSHUL KASHYAP",
      city: "Ghaziabad",
      mobile: "9968237063",
      intransit: "0",
      received: "0",
    },
    {
      code: "002",
      companylink: "MANIMAHESH TRANSPORT COMPANY",
      companyid: "09JFBPK9902Q1ZL",
      ownername: "ANSHUL KASHYAP",
      city: "Ghaziabad",
      mobile: "9968237063",
      intransit: "0",
      received: "0",
    },
  ];

  // const totalRows = data.length;

  // const handlePageChange = (page:any) => {
  //   setCurrentPage(page);

  // };

  // const handleRowsPerPageChange = (newPerPage:any) => {
  //   setRowsPerPage(newPerPage);

  // };

  // react select options
  const options = [
    { value: "AllState", label: "All State" },
    { value: "Delhi", label: "Delhi" },
    { value: "Haryana", label: "Haryana" },
    { value: "Rajasthan", label: "Rajasthan" },
  ];
  const cityoptions = [
    { value: "AllCity", label: "All City" },
    { value: "Lucknow", label: "Lucknow" },
    { value: "Jaipur", label: "Jaipur" },
    { value: "Sonipat", label: "Sonipat" },
  ];

  return (
    <>
      <Breadcrumb
        pageTitle="Transport"
        pageCategory="Transport"
        activePage="All Transport"
        previouspageurl="/"
        addbuttn={true}
        excelbuttn={false}
        filterbuttn={true}
        handleOpenCreateModal={handleOpenCreateModal}
        handleOpenFilterModal={handleOpenFilterModal}
      />
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
          <div className="search_boxes flex justify-between">
            <div className="w-[10%]">
              <select
                name=""
                id=""
                className="rounded-md w-full border border-buttnhover p-2  focus:outline-none focus:border-buttnhover"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
              </select>
            </div>
            <div className="w-[10%]">
              <input
                type="search"
                className="rounded-md w-full border border-buttnhover p-2  placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
              />
            </div>
          </div>

          <ReactTable
            data={data}
            columns={columns} loading={false} totalRows={0}            // loading={loading}
            // totalRows={totalRows}
            // onChangePage={handlePageChange}
            // onChangeRowsPerPage={handleRowsPerPageChange}
            // pagination
            // paginationPerPage={rowsPerPage}
            // paginationRowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </div>

      <>
        {showCreateModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowCreateModal(!showCreateModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[87vh] xl:w-[30rem] 3xl:w-[50rem]  top-[10%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">
                  Add Transport
                </h4>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body py-3  px-5">
                {/* select gst type */}

                <div className="flex flex-wrap -mx-3">
                  <div className="w-full md:w-1/3 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      GST Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      onChange={(e) => setRegistered(e.target.value)}
                      value={registered}
                      name="cars"
                      id="cars"
                      className="  text-sm font-normal block w-full  border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none  focus:border-primarycolor"
                      defaultValue="Status"
                    >
                      <option value="RegisteredBusiness">
                        Registered Business
                      </option>
                      <option value="UnRegisteredBusiness">
                        UnRegistered Business
                      </option>
                    </select>
                  </div>
                  {registered == "RegisteredBusiness" && (
                    <div className="w-full md:w-1/3 px-3">
                      <label
                        className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                        htmlFor="grid-first-name"
                      >
                        GSTIN No <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                        id="grid-first-name"
                        type="number"
                        placeholder="Enter GSTIN No"
                        onChange={(e) => setGSTINNo(e.target.value)}
                        value={gstinno}
                      />
                    </div>
                  )}
                  <div className="w-full md:w-1/3 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Transport Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      type="text"
                      placeholder="Enter GSTIN No"
                      onChange={(e) => setTransportName(e.target.value)}
                      value={transportname}
                    />
                  </div>
                </div>

                <div className="form_1 my-2 bg-[#f7f7f7] p-4">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-2  ">
                      Basic Details
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Owner Name
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter Owner Name"
                          onChange={(e) => setOwnerName(e.target.value)}
                          value={ownername}
                        />
                      </div>

                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Mobile <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={mobile}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Mobile No"
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Alternate Mobile No{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={alternatemobile}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Mobile No"
                          onChange={(e) => setAlternateMobile(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap  -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Phone 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={phone1}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Phone No."
                          onChange={(e) => setPhone1(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Phone 2 <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={phone2}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Phone No."
                          onChange={(e) => setPhone2(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          PAN No. <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={panno}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter PAN No."
                          onChange={(e) => setPanNo(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Address 1 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          placeholder="Enter Address Line 1"
                          onChange={(e) => setAddress1(e.target.value)}
                          value={address1}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Address 2 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
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
                          State <span className="text-red-500">*</span>
                        </label>

                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          // defaultValue={options[0]}
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name="color"
                          options={options}
                          styles={customReactStylesSmall}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          City
                        </label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name="color"
                          options={options}
                          styles={customReactStylesSmall}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Pincode
                        </label>
                        <textarea
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          placeholder="Enter Pincode"
                          onChange={(e) => setPincode(e.target.value)}
                          value={pincode}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form_2 bg-[#f7f7f7] p-4">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-2   ">
                      Bank Details
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
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter Bank Name"
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
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
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
                          className="appearance-none  text-sm font-normal block w-full   border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Company"
                          onChange={(e) => setBranch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter IFSC Code"
                          onChange={(e) => setIFSCCode(e.target.value)}
                          value={ifsccode}
                        />
                      </div>

                      <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          onChange={(e) => setStatus(e.target.value)}
                          value={status}
                          name="cars"
                          id="cars"
                          className="  text-sm font-normal block w-full  border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none  focus:border-primarycolor"
                          defaultValue="Status"
                        >
                          <option value="Select Category">Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/3 mt-3">
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

      {/* filter modal */}
      <>
        {showFilterModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowFilterModal(!showCreateModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[30vh] xl:w-[30rem] 3xl:w-[38rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
                  <MdOutlineFilterAlt className="text-white" /> Select and Apply
                  Filter
                </h4>
                <button type="button" onClick={() => setShowFilterModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body py-3 px-4">
                <div className="flex flex-wrap -mx-3 mb-3">
                 
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      State <span className="text-red-500">*</span>
                    </label>

                    <Select  className="basic-single"
                      classNamePrefix="select"
                      defaultValue={options[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={options}
                      styles={customReactStylesSmall}
                    />
                  </div>

                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      City 
                    </label>

                    <Select  className="basic-single"
                      classNamePrefix="select"
                      defaultValue={options[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={cityoptions}
                      styles={customReactStylesSmall}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3">

                <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Role 
                    </label>

                    <Select  className="basic-single"
                      classNamePrefix="select"
                      defaultValue={options[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={options}
                      styles={customReactStylesSmall}
                    />
                  </div>
            
                  <div className="w-full md:w-1/2 px-3 ">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Status
                    </label>
                    <select
                      onChange={(e) => setStatus(e.target.value)}
                      value={status}
                      name="cars"
                      id="cars"
                      className="  text-sm font-normal block w-full  border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none  focus:border-primarycolor"
                      defaultValue="All Status"
                    >
                      <option value="All Status">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                 
                </div>

                <div className="w-full md:w-1/3 mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor"
                  >
                    Apply Filter
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
