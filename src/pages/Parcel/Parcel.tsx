import { FiEdit } from "react-icons/fi";
// import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
// import { toastError } from "../../utils/TOAST";
// import { FaFileAlt } from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";
import Select from "react-select";
import { customReactStylesSmall } from "../../utils/ReactSelectStyle";
import { IoIosSearch } from "react-icons/io";

import moment from "moment";
import { Link } from "react-router-dom";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";

export default function Parcel() {
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
  const [status, setStatus] = useState("");
  const [lrno, setLRNo] = useState("");
  const [lrdate, setLRDate] = useState(new Date());
  const [invoiceno, setInvoiceNo] = useState("");
  const [invoicedate, setInvoiceDate] = useState(new Date());
  const [parcelqty, setParcelQty] = useState("");
  const [receivedate, setReceiveDate] = useState(new Date());
  const [photo, setPhoto] = useState("");
  const [time, setTime] = useState("");
  const [remarks, setRemarks] = useState("");



  const [showCreateModal, setShowCreateModal] = useState(false);


  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
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
      name: "REF-NO",
      selector: (row: any) => row.refno,
      width: "6%",
    },

    {
      name: "INV-NO",
      selector: (row: any) => row.invoiceno,
      width: "8%",
    },
    {
      name: "PARTY",
      selector: (row: any) => row.party,
      width: "15%",
    },
    {
      name: "TRANSPORT",
      selector: (row: any) => row.transport,
      width: "10%",
    },

    {
      name: "LR-NO",
      selector: (row: any) =>
       row.lrno,
      width: "8%",
    },
    {
      name: "PARCEL-QTY",
      selector: (row: any) =>
       row.parcelqty,
      width: "8%",
    },
    {
      name: "RCV-DATE",
      selector: (row: any) =>
       row.receivedate,
      width: "10%",
    },
    {
      name: "STATUS",
      selector: (row: any) =>
       row.status,
      width: "9%",
    },
    {
      name: "RCV-BY",
      selector: (row: any) =>
       row.rcvby,
      width: "8%",
    },
    {
      name: "PHOTO",
      selector: (row:any) => row.amount,
      width: "10%",
    },


    // {
    //   name: "Status",
    //   width: "5%",
    //   selector: () => (
    //   <>
    //     <button
    //         type="button"
    //         onClick={handleShowSearchModal}
    //         className="text-[#26af48] bg-[#0fb76b1f] p-2 text-[1.1rem]"
    //       >
    //         <FiEdit />
    //       </button>
    //   </>
             
        
        
      
      
    //   ),
    // },
    {
      name: "Action",
      width: "8%",
      selector: () => (
        <div className="flex items-center gap-3">
              <Link to="/edit-invoice-payment" className="text-[#26af48] bg-[#0fb76b1f] p-2 text-[1.1rem]">
            <FiEdit />
          </Link>
          <button
            type="button"
            onClick={handleshowLogsModal}
            className="text-blue-400 bg-[#1194f71f] p-2 text-[1.1rem]"
          >
            <IoIosSearch />
          </button>
          {/* <button onClick={handleshowLogsModal} className="text-[#1db9b1] bg-[#02b6b31f] p-2 text-[1.1rem]">
            <PiClockCounterClockwise />
          </button> */}
      
        </div>
      ),
    },
  ];

  // Sample data
  const data = [
    {
      
      refno: "007961",
      invoiceno: "On Account",
      party: "SAINI VASTRA ",
      transport: "",
      lrno: "",
      parcelqty: "",
      receivedate: "24/10/2024",
      status:"pending",
    rcvby:"",
      photo: "",
   
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
  const paymentmodeoptions = [
    { value: "All", label: "All" },
    { value: "Cheque", label: "Cheque" },
    { value: "DebitCard", label: "Debit Card" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Cash", label: "Cash" },
    { value: "Online", label: "Online" },
    { value: "UPI", label: "UPI" },
    { value: "Discount", label: "Discount" },
  ];
  const supplieroptions = [
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },

  ];
  const transportoptions = [
    { value: "GOLDEN ROADWAYS", label: "GOLDEN ROADWAYS" },
    { value: "GOLDEN ROADWAYS", label: "GOLDEN ROADWAYS" },
    { value: "GOLDEN ROADWAYS", label: "GOLDEN ROADWAYS" },
    { value: "GOLDEN ROADWAYS", label: "GOLDEN ROADWAYS" },
  
  ];



  return (
    <>
      <Breadcrumb
        pageTitle="Parcel"
        pageCategory="Dashboard"
        activePage="All Parcel"
        addbuttn={true}
        withLink={false}
        previouspageurl="/"
         addbuttnurl="/add-invoice-payment"
         additionaltext="Parcel"
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



           {/* Add parcel modal box */}
           <>
        {showCreateModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowCreateModal(!showCreateModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[78vh] xl:w-[40rem] 3xl:w-[50rem]  top-[15%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
                   Create New Parcel Entry REF NO :#000001
                </h4>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body  p-4">
                <div className="flex flex-wrap  mb-3">
                <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Supplier <span className="text-red-500">*</span>
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={supplieroptions[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={supplieroptions}
                      styles={customReactStylesSmall}
                    />
                  </div>
                <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Transport <span className="text-red-500">*</span>
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={transportoptions[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={transportoptions}
                      styles={customReactStylesSmall}
                    />
                  </div>
               
                

                

             
                </div>

                <div className="flex flex-wrap  mb-3">
                <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      LR NO <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="text"
                      onChange={(e) => setLRNo(e.target.value)}
                      value={lrno}
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
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setLRDate(new Date(e.target.value))}
                      value={moment(lrdate).format("YYYY-MM-DD")}
                    />
                  </div>
          
                </div>
                <div className="flex flex-wrap  mb-3">
                <div className="w-full md:w-1/3 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Invoice No <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder="Enter Invoice No"
                      type="text"
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      value={invoiceno}
                    />
                  </div>
          
                <div className="w-full md:w-1/3 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Invoice Date  <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setInvoiceDate(new Date(e.target.value))}
                      value={moment(invoicedate).format("YYYY-MM-DD")}
                    />
                  </div>

                  <div className="w-full md:w-1/3 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Invoice Qty <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder="Enter Invoice No"
                      type="text"
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      value={invoiceno}
                    />
                  </div>
          
                </div>
                <div className="flex flex-wrap  mb-3">
                <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Parcel Qty <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder="Enter Invoice No"
                      type="text"
                      onChange={(e) => setParcelQty(e.target.value)}
                      value={parcelqty}
                    />
                  </div>
           <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Pay Mode <span className="text-red-500">*</span>
                    </label>
                    <select onChange={(e) => setStatus(e.target.value)} value={status} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none  focus:border-primarycolor" defaultValue="Select State">
                                        <option value="Select">Select</option>
                                        <option value="ToPay">To Pay</option>
                                        <option value="Paid">Paid</option>
                                     
                                    
                                    </select>
                   
                  </div> 

          
        

        
          
                </div>


                <div className="flex flex-wrap  mb-3">
                <div className="w-full md:w-1/3 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Upload Photo <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder="Enter Invoice No"
                      type="file"
                      onChange={(e) => setPhoto(e.target.value)}
                      value={photo}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Receiving Date  <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setReceiveDate(new Date(e.target.value))}
                      value={moment(receivedate).format("YYYY-MM-DD")}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Time  <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="time"
                      onChange={(e) => setTime(e.target.value)}
                     value={time}
                    />
                  </div>

          
        

        
          
                </div>
                <div className="w-full px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Remarks  <span className="text-red-500">*</span>
                    </label>
                    <textarea
                    rows={3}
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder="Enter Remarks"
          
                      onChange={(e) => setRemarks(e.target.value)}
                     value={remarks}
                    />
                  </div>

  
                <div className="w-1/6 mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor w-full text-white  py-[10px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Add Parcel
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
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[34vh] xl:w-[40rem] 3xl:w-[50rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
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
                  <div className="w-full md:w-1/2 px-3">
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
                  <div className="w-full md:w-1/2 px-3">
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
               

                

                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Company
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={paymentmodeoptions[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={paymentmodeoptions}
                      styles={customReactStylesSmall}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Status
                    </label>
                    <select onChange={(e) => setStatus(e.target.value)} value={status} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none  focus:border-primarycolor" defaultValue="Select State">
                                        <option value="All">All</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Complete">Complete</option>
                                        <option value="Cancel">Cancel</option>
                                    
                                    </select>
                   
                  </div>
                </div>

         
  
                <div className="w-1/6 mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor w-full text-white  py-[10px] text-text15 rounded-md hover:bg-secondarycolor"
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
