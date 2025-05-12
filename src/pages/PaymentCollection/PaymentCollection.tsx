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

import moment from "moment";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";

export default function PaymentCollection() {
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);
  const [isDisabled] = useState(false);
  const [isLoading] = useState(false);
  const [isRtl] = useState(false);

  const [startdate, setStartDate] = useState(new Date());
  const [paidstartdate, setPaidStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [paidenddate, setPaidEndDate] = useState(new Date());
  const [status, setStatus] = useState("");
  const [chequepassdate, setChequePassDate] = useState(new Date());
  const [reason, setReason] = useState("");


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
      name: "Paid Date",
      selector: (row: any) => row.paiddate,
      width: "6%",
    },

  
    {
      name: "Receipt No",
      selector: (row: any) => (
        <>
          <Link to="/debit-credit-note" className="text-[#009ce7] hover:text-blue-600 font-medium">
            {row.receiptno}
          </Link>
        </>
      ),
      width: "8%",
    },

    {
      name: "Invoice No",
      selector: (row: any) => row.invoiceno,
      width: "8%",
    },
    {
      name: "Customer",
      selector: (row: any) => row.customer,
      width: "13%",
    },

    {
      name: "Pay-Mode/Bank",
      selector: (row: any) =>
        <>
        <h6 className="text-text15 mb-1 ">{row.paymodehead1}</h6>
        <p className="mb-0 text-sm"> {row.paymodehead2}</p>
        </>,
      width: "15%",
    },
    {
      name: "Amount",
      selector: (row:any) => row.amount,
      width: "10%",
    },
    {
      name: "Cashier",
      selector: (row:any) => row.cashier,
      width: "10%",
    },
  
   
    {
      name: "Tally",
      selector: () => (
     
        <h6 className="bg-red-500 text-white text-[0.75rem] py-1 p-3 rounded-xl">
          Unread
        </h6>
      ),

      width: "6%",
    },

    {
      name: "Rcv-At",
      selector: (row:any) => row.rcvat,
      width: "11%",
    },

    {
      name: "Status",
      width: "5%",
      selector: () => (
      <>
        <button
            type="button"
            onClick={handleShowSearchModal}
            className="text-[#26af48] bg-[#0fb76b1f] p-2 text-[1.1rem]"
          >
            <FiEdit />
          </button>
      </>
             
        
        
      
      
      ),
    },
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
      
      paiddate: "24/10/2024",
      receiptno: "007961",
      invoiceno: "On Account",
      customer: "SAINI VASTRA BHANDAR",
      mobile:"9810344113",
      paymodehead1:"ONLINE",
      paymodehead2:"ICICI BANK A/C-777705100097",
      amount: "25000.00",
      cashier: "TILAK RAJ MUNIM JI",
      rcvat:"29/10/2024 12:38:05",
    },
    {
      
      paiddate: "24/10/2024",
      receiptno: "007961",
      invoiceno: "On Account",
      customer: "SAINI VASTRA BHANDAR",
      mobile:"9810344113",
      paymodehead1:"ONLINE",
      paymodehead2:"ICICI BANK A/C-777705100097",
      amount: "25000.00",
      cashier: "TILAK RAJ MUNIM JI",
      rcvat:"29/10/2024 12:38:05",
    },
    {
      
      paiddate: "24/10/2024",
      receiptno: "007961",
      invoiceno: "On Account",
      customer: "SAINI VASTRA BHANDAR",
      mobile:"9810344113",
      paymodehead1:"ONLINE",
      paymodehead2:"ICICI BANK A/C-777705100097",
      amount: "25000.00",
      cashier: "TILAK RAJ MUNIM JI",
      rcvat:"29/10/2024 12:38:05",
    },
    {
      
      paiddate: "24/10/2024",
      receiptno: "007961",
      invoiceno: "On Account",
      customer: "SAINI VASTRA BHANDAR",
      mobile:"9810344113",
      paymodehead1:"ONLINE",
      paymodehead2:"ICICI BANK A/C-777705100097",
      amount: "25000.00",
      cashier: "TILAK RAJ MUNIM JI",
      rcvat:"29/10/2024 12:38:05",
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

  const cashiercodeoptions = [
    { value: "All", label: "All" },
    { value: "SMS-001", label: "SMS-001" },
    { value: "SMS-002", label: "SMS-002" },
    { value: "SMS-003", label: "SMS-003" },
    { value: "SMS-004", label: "SMS-004" },
    { value: "SMS-005", label: "SMS-005" },

  ];

  return (
    <>
      <Breadcrumb
        pageTitle="PAYMENT COLLECTION"
        pageCategory="TOTAL: 138898"
        activePage="CHEQUE: 568094 / DEBIT CARD: 00 / CREDIT CARD: 00 / CASH: 60215 / ONLINE: 40000 / UPI: 00 / DISCOUNT: 00"
        addbuttn={true}
        withLink={true}
        previouspageurl="/"
         addbuttnurl="/add-invoice-payment"
        excelbuttn={true}
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
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[42vh] xl:w-[40rem] 3xl:w-[50rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
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
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Paid Start Date
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setPaidStartDate(new Date(e.target.value))}
                      value={moment(paidstartdate).format("YYYY-MM-DD")}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Paid End Date
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setPaidEndDate(new Date(e.target.value))}
                      value={moment(paidenddate).format("YYYY-MM-DD")}
                    />
                  </div>

                

                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Payment Mode
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
                      Cashier
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={cashiercodeoptions[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={cashiercodeoptions}
                      styles={customReactStylesSmall}
                    />
                  </div>
                </div>

         
<div className="flex justify-between">
  
<div className="w-1/6 mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor w-full text-white  py-[10px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Apply Filter
                  </button>
                </div>
<div className="w-[12%] mt-3">
                  <button
                    type="submit"
                    className="bg-red-500 w-full text-white  text-sm p-2 py-[10px] rounded-md hover:bg-secondarycolor"
                  >
                    Clear
                  </button>
                </div>
</div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>

    

      {/* After Click on table status edit button this modal box opens */}

      <>
        {showSearchButtonModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowSearchButtonModal(!showSearchButtonModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[36vh]  xl:w-[36rem] 3xl:w-[50rem]  top-[12%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">
                  Update Payment Details
                </h4>
                <button
                  type="button"
                  onClick={() => setShowSearchButtonModal(false)}
                >
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body py-3 ps-3 pe-4">
             
                <div className="form_1 mb-3 border-l-4 border-[#ddd] ps-3">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-4 flex items-center gap-2  ">
                      <FaFileAlt />
                     Payment Details
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/2 px-5">
                        <label
                          className="block  tracking-wide text-txtcolor font-medium text-text15 mb-3"
                          htmlFor="grid-first-name"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>
                        <select onChange={(e) => setStatus(e.target.value)} value={status} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none  focus:border-primarycolor" defaultValue="Select State">
                                        <option value="PDC">PDC</option>
                                        <option value="Clearing">Clearing</option>
                                        <option value="Cleared">Cleared</option>
                                        <option value="Bounced">Bounced</option>
                                    
                                    </select>
                      </div>

{
  status == "Cleared" &&

  <>
     {/* cheque passed date */}

     <div className="w-full md:w-1/2 px-5">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Cheque Pass Date
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setChequePassDate(new Date(e.target.value))}
                      value={moment(chequepassdate).format("YYYY-MM-DD")}
                    />
                  </div>
  </>
}
                   



{
  status == "Bounced" &&
  <>
    {/* cheque failed date */}

    <div className="w-full md:w-1/2 px-5">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Cheque Fail Date
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="date"
                      onChange={(e) => setChequePassDate(new Date(e.target.value))}
                      value={moment(chequepassdate).format("YYYY-MM-DD")}
                    />
                  </div>


                    {/* Reason*/}

                    <div className="w-full  px-5">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                     Reason
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      placeholder=""
                      type="text"
                      onChange={(e) => setReason(e.target.value)}
                      value={reason}
                    />
                  </div>
  </>
 
}


                  

                  
                    
                    </div>
                  </div>

                  <div className="w-full flex justify-end mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor w-[12%] text-white  py-[9px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Update
                  </button>
                </div>
                </div>

            

             

             
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>

      {/* after click on the search button in the table this modal open Bill Payment Details */}

  
       <>
        {showLogsModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowLogsModal(!showLogsModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[50vh]  xl:w-[40rem] 3xl:w-[50rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
                Bill Payment Details
                </h4>
                <button type="button" onClick={() => setShowLogsModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body p-4">
                {/* debit credit note details */}
                <div className="form_1 mb-3 border-l-4 border-[#ddd] ps-3">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-3 flex items-center gap-2  ">
                    
                      Payment Details
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3 mb-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-semibold  mb-2"
                          htmlFor="grid-first-name"
                        >
                          Receipt No:
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                        
                          007969
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Paid Date:
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                         
                          26/10/2024
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Invoice No:
                        </label>
                        {/* note  */}
                        <h6 className="text-secondarycolor font-medium text-sm">
                         
                        </h6>
                      </div>
                  
                    </div>

                    <div className="flex flex-wrap -mx-3 ">
                    <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-semibold  mb-2"
                          htmlFor="grid-first-name"
                        >
                         Amount:
                         
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                        
                        40805.00
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Payment Mode:
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                         
                          CHEQUE
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Collect By: 
                        </label>
                        {/* note  */}
                        <h6 className="text-secondarycolor font-medium ">
                        SMS-102
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="form_2 mb-3 border-l-4 border-[#ddd] ps-3">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-3 flex items-center gap-2  ">
                    
                      Customer Details
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3 mb-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-semibold  mb-2"
                          htmlFor="grid-first-name"
                        >
                         Name:
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                        
                        Grijesh
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Company Name:
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                         
                        DASHMESH CLOTH HOUSE RAMPUR
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Customer Code:
                        </label>
                   
                        <h6 className="text-secondarycolor font-medium text-sm">
                        CS-950
                        </h6>
                      </div>
                  
                    </div>

                    <div className="flex flex-wrap -mx-3 ">
                    <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-semibold  mb-2"
                          htmlFor="grid-first-name"
                        >
                         Mobile:
                         
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                        
                        9045643351
                        </h6>
                      </div>
                      <div className="w-full md:w-2/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Address:
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                         
                        MAIN MARKET CHAK SWAR Rampur Uttar Pradesh - 244924
                        </h6>
                      </div>
                
                    </div>
                  </div>
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
