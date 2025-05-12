import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
// import { toastError } from "../../utils/TOAST";
// import { FaFileAlt } from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";
import Select from "react-select";
import { customReactStylesSmall } from "../../utils/ReactSelectStyle";
import { IoIosSearch } from "react-icons/io";
import { PiClockCounterClockwise } from "react-icons/pi";
import moment from "moment";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";

export default function DebitCreditNote() {
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);
  const [isDisabled] = useState(false);
  const [isLoading] = useState(false);
  const [isRtl] = useState(false);

  const [startdate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [notetype, setNoteType] = useState("");
  const [searchvalue, setSearchValue] = useState("");
  const [lrdate, setLRDate] = useState(new Date());

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLRModal, setShowLRModal] = useState(false);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };
  const handleOpenLRModal = () => {
    setShowLRModal(true);
  };

  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  // show search button modal
  const [showSearchButtonModal, setShowSearchButtonModal] = useState(false);

  const handleShowSearchModal = () => {
    setShowSearchButtonModal(!showSearchButtonModal);
  };

  // show logs modal box

  const [showLogsModal,setShowLogsModal] = useState(false)

  const handleshowLogsModal = () =>
  {
    setShowLogsModal(!showLogsModal)
  }

  const columns = [
    {
      name: "Type",
      selector: (row: any) => row.type,
      width: "8%",
    },

    {
      name: "Invoice-Dt",
      selector: (row: any) => row.invoicedate,
      width: "9%",
    },
    {
      name: "Invoice-No",
      selector: (row: any) => (
        <>
          <Link to="/debit-credit-note" className="text-[#009ce7] hover:text-blue-600 font-medium">
            {row.invoiceNo}
          </Link>
        </>
      ),
      width: "10%",
    },

    {
      name: "Party",
      selector: (row: any) => row.party,
      width: "17%",
    },
    {
      name: "Amount",
      selector: (row: any) => row.amount,
      width: "10%",
    },
    {
      name: "E-Invoice",
      selector: () => (
        <button className="bg-txtcolor text-white text-[0.75rem] py-1 px-5 rounded-xl">
          Generate
        </button>
      ),
      width: "8%",
    },
    {
      name: "LR",
      selector: () => (
        <button
          type="button"
          onClick={handleOpenLRModal}
          className="bg-greencolor text-white text-[0.75rem] py-1 px-5 rounded-xl"
        >
          Update LR
        </button>
      ),
      width: "8%",
    },
    {
      name: "Status",
      selector: (row: any) => row.status,
      width: "10%",
    },
    {
      name: "Tally",
      selector: () => (
        // <h6 className="bg-greencolor text-white text-[0.75rem] py-1 p-3 rounded-md">Unread</h6>,
        <h6 className="bg-red-500 text-white text-[0.75rem] py-1 p-3 rounded-xl">
          Unread
        </h6>
      ),

      width: "10%",
    },

    {
      name: "Action",
      width: "10%",
      selector: () => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShowSearchModal}
            className="text-blue-400 bg-[#1194f71f] p-2 text-[1.1rem]"
          >
            <IoIosSearch />
          </button>
          <button onClick={handleshowLogsModal} className="text-[#1db9b1] bg-[#02b6b31f] p-2 text-[1.1rem]">
            <PiClockCounterClockwise />
          </button>
          <Link to="/edit-credit-note" className="text-[#26af48] bg-[#0fb76b1f] p-2 text-[1.1rem]">
            <FiEdit />
          </Link>
        </div>
      ),
    },
  ];

  // Sample data
  const data = [
    {
      type: "Credit Note",
      invoicedate: "24/10/2024",
      invoiceNo: "CN/24-25-2854",
      party: "JAIPURI COLLECTION - (BAREILY)",
      amount: "19059.00",
      status: "Pending",
    },
    {
      type: "Debit Note",
      invoicedate: "24/10/2024",
      invoiceNo: "CN/24-25-2854",
      party: "JAIPURI COLLECTION - (BAREILY)",
      amount: "19059.00",
      status: "Pending",
    },
    {
      type: "Credit Note",
      invoicedate: "24/10/2024",
      invoiceNo: "CN/24-25-2854",
      party: "JAIPURI COLLECTION - (BAREILY)",
      amount: "19059.00",
      status: "Pending",
    },
    {
      type: "Debit Note",
      invoicedate: "24/10/2024",
      invoiceNo: "CN/24-25-2854",
      party: "JAIPURI COLLECTION - (BAREILY)",
      amount: "19059.00",
      status: "Pending",
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

  const searchOnOptions = [
    { value: "Select", label: "Select" },
    { value: "Invoice-no", label: "Invoice-no" },
    { value: "Total-Amt", label: "Total-Amt" },
    { value: "IRN-No", label: "IRN-No" },
    { value: "LR-No", label: "LR-No" },
    { value: "ACK-No", label: "ACK-No" },
  ];

  return (
    <>
      <Breadcrumb
        pageTitle="Debit/Credit Note"
        pageCategory="Debit/Credit Note"
        activePage="All Debit/Credit Note"
        addbuttn={true}
        withLink={true}
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

      {/* filter modal */}
      <>
        {showFilterModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowFilterModal(!showCreateModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[32vh] xl:w-[40rem] 3xl:w-[50rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
                  <MdOutlineFilterAlt className="text-white" /> Select and Apply
                  Filter
                </h4>
                <button type="button" onClick={() => setShowFilterModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body  p-4">
                <div className="flex flex-wrap -mx-3 mb-3">
                  <div className="w-full md:w-1/4 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Start Date
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      value={moment(startdate).format("YYYY-MM-DD")}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      End Date
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                      value={moment(enddate).format("YYYY-MM-DD")}
                    />
                  </div>

                  <div className="w-full md:w-[20%] px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      onChange={(e) => setNoteType(e.target.value)}
                      value={notetype}
                      name="cars"
                      id="cars"
                      className="  text-sm font-normal block w-full  border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      defaultValue="Note Type"
                    >
                      <option value="All">All</option>
                      <option value="CN">CN</option>
                      <option value="DN">DN</option>
                    </select>
                  </div>

                  <div className="w-full md:w-[30%] px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Party
                    </label>

                    <Select
                      className="basic-single"
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
                </div>

                <div className="flex gap-3">
                  <div className="w-full md:w-1/4 ">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Search On <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={searchOnOptions[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={searchOnOptions}
                      styles={customReactStylesSmall}
                    />
                  </div>

                  <div className="w-full md:w-3/4 ">
                    <label
                      className="block  tracking-wide text-white text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Party
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="text"
                      onChange={(e) => setSearchValue(e.target.value)}
                      value={searchvalue}
                    />
                  </div>
                </div>

                <div className="w-full mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor w-full text-white px-5 py-3 rounded-md hover:bg-secondarycolor"
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

      {/* update LR Modal */}

      <>
        {showLRModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowLRModal(!showLRModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[24vh] xl:w-[40rem] 3xl:w-[50rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
                  Update LR for Invoice No. CN/24-25-2916
                </h4>
                <button type="button" onClick={() => setShowLRModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body  p-4">
                <div className="flex flex-wrap -mx-3 mb-3">
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      LR No
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder="Enter LR No"
                      type="text"
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      value={moment(startdate).format("YYYY-MM-DD")}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      LR Date
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setLRDate(new Date(e.target.value))}
                      value={moment(lrdate).format("YYYY-MM-DD")}
                    />
                  </div>
                </div>

                <div className="w-1/2 mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor  text-white px-5 py-3 rounded-md hover:bg-secondarycolor"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>

      {/* After Click on table  search button this modal box opens */}

      <>
        {showSearchButtonModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowSearchButtonModal(!showSearchButtonModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] min-h-[76vh]  xl:w-[36rem] 3xl:w-[50rem]  top-[12%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">
                  Debit/Credit Note Details
                </h4>
                <button
                  type="button"
                  onClick={() => setShowSearchButtonModal(false)}
                >
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body py-3 ps-3 pe-4">
                {/* debit credit note details */}
                <div className="form_1 mb-3 border-l-4 border-[#ddd] ps-3">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-3 flex items-center gap-2  ">
                      <FaFileAlt />
                      Debit/Credit Note Details
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-semibold text-sm mb-3"
                          htmlFor="grid-first-name"
                        >
                          Ref No
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                          {/* invoice no ayega dynamically on click of that particular row */}
                          CN/24-25-2916
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Return Date
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                          {/* return date ayega dynamically on click of that particular row */}
                          26/10/2024
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Note
                        </label>
                        {/* note  */}
                        <h6 className="text-secondarycolor font-medium text-sm">
                          MELA SCHEME 2024-25 + 1367 DISCOUNT
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                {/* billing address */}

                <div className="form_1 mb-3 border-l-4 border-[#ddd] p-3 bg-[#f3f1f1]">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-3 flex items-center gap-2  ">
                      <FaFileAlt />
                      Billing Address
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3 mb-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-semibold text-sm mb-3"
                          htmlFor="grid-first-name"
                        >
                          Name
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                          {/* Name ayega dynamically on click of that particular row */}
                          Customer Name
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Company Name
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                          {/* company name ayega dynamically on click of that particular row */}
                          VARDAN ANOLA
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Customer Code
                        </label>
                        {/* customer code  */}
                        <h6 className="text-secondarycolor font-medium text-sm">
                          CS-6237
                        </h6>
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-semibold text-sm mb-3"
                          htmlFor="grid-first-name"
                        >
                          Mobile
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                          {/* Mobile no ayega dynamically on click of that particular row */}
                          9258400000
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Address
                        </label>
                        <h6 className="text-secondarycolor font-medium text-[0.8rem]">
                          {/* address ayega dynamically on click of that particular row */}
                          70, MOHALLA SITAV RAY, GHATA GHAR Achhalda Uttar
                          Pradesh - 243301
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                {/* return details */}
                <div className="form_1 mb-3 border-l-4 border-[#ddd] py-2 px-3  bg-[#ffffd0]">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-3 flex items-center gap-2  ">
                      <FaFileAlt />
                      Billing Address
                    </h5>
                  </div>

                  <div className="form">
                    <table className="border p-2 border-[#e5e5e5] w-full">
                      <tr>
                        <th className="text-[0.85rem] border-r border-b border-[#e5e5e5] px-4 py-2 w-[35%] ">
                          Item
                        </th>
                        <th className="text-[0.85rem] border-r border-b border-[#e5e5e5] px-4 py-2 w-[15%] ">
                          HSN Code
                        </th>
                        <th className="text-[0.85rem] border-r border-b border-[#e5e5e5] px-4 py-2 w-[15%] ">
                          Rate
                        </th>
                        <th className="text-[0.85rem] border-r border-b border-[#e5e5e5] px-4 py-2 w-[20%]">
                          Tax
                        </th>
                        <th className="text-[0.85rem] border-r border-b border-[#e5e5e5] px-3 py-2 w-[15%] ">
                          Amount
                        </th>
                      </tr>
                      <tr>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          {/* Name ayega dynamically on click of that particular row */}
                          DISCOUNT / SCHEME SALES @630790
                        </td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          {/* Name ayega dynamically on click of that particular row */}
                          630790
                        </td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          {/* Name ayega dynamically on click of that particular row */}
                          10149
                        </td>
                        <td className="text-green-600 font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-1 text-center">
                          IGST: 1217.88 @12.00%
                        </td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          11366.88
                        </td>
                      </tr>
                      <tr>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-green-600 font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          Subtotal
                        </td>
                        <td className="text-secondarycolor font-semibold border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          10149.00
                        </td>
                      </tr>
                      <tr>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          IGST (+)
                        </td>
                        <td className="text-red-500 font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          1217.88
                        </td>
                      </tr>
                      <tr>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          Round off (+/-)
                        </td>
                        <td className="text-red-500 font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          0.12
                        </td>
                      </tr>
                      <tr>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center"></td>
                        <td className="text-secondarycolor font-semibold border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          Final Amount
                        </td>
                        <td className="text-secondarycolor font-semibold border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                          11367.00
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>

             
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>

      {/* after click on the timeout button in the table this modal open */}

       {/* debit credit note logs  Modal */}

       <>
        {showLogsModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowLogsModal(!showLogsModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] max-h-[20vh] overflow-auto xl:w-[40rem] 3xl:w-[50rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
                Debit/Credit Note Logs of Invoice No : CN/24-25-2916
                </h4>
                <button type="button" onClick={() => setShowLogsModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body  p-4">
              <table className="border p-2 border-[#e5e5e5] w-full">
                      <tr>
                        <th className="text-text15 border-r border-b border-[#e5e5e5] px-4 py-2 w-[35%] text-left ">
                          Type
                        </th>
                        <th className="text-text15 border-r border-b border-[#e5e5e5] px-4 py-2 w-[15%] text-left ">
                          Action
                        </th>
                        <th className="text-text15 border-r border-b border-[#e5e5e5] px-4 py-2 w-[15%] text-left ">
                          Action By
                        </th>
                        <th className="text-text15 border-r border-b border-[#e5e5e5] px-4 py-2 w-[35%] text-left">
                          Time
                        </th>
                       
                      </tr>
                      <tr>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.85rem] py-3 px-3 ">
                         Debit Credit Note
                        </td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.85rem] py-3 px-3 ">
                         Add
                        </td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.85rem] py-3 px-3 ">
                        SMS-012
                        </td>
                        <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.85rem] py-3 px-3 ">
                        26/10/2024 19:03:52
                        </td>
                      
                      </tr>
                   
                    </table>

           
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
