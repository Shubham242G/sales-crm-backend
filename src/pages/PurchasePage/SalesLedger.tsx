
// import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { AiFillCloseSquare } from "react-icons/ai";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";

import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Select from "react-select";

import { useState } from "react";

import { MdOutlineFilterAlt } from "react-icons/md";
import moment from "moment";
import { customReactStylesSmall1 } from "@/utils/ReactSelectStyle";
import { set } from "lodash";

export default function SalesLedger() {

  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);
  const [isDisabled] = useState(false);
  const [isLoading] = useState(false);
  const [isRtl] = useState(false);
  
  const [startdate,setStartDate] = useState(new Date())
  const [enddate,setEndDate] = useState(new Date())
  const [overduedays,setOverdueDays] = useState("")
  const [leadId, setLeadId] = useState("")
  const [paymentstatus,setPaymentStatus] = useState("")
  const [billtype,setBillType] = useState("")
  const [openingdate,setOpeningDate] = useState(new Date())
  const [openingamount,setOpeningAmount] = useState("")
  
  const [selectednote,setSelectedNote] = useState("creditnote")
  
  


  // bill modal 
  const [showBillDetailsModal, setShowBillDetailsModal] = useState(false);

  const handleOpenBillModal = () => {
    setShowBillDetailsModal(true);
  };


  // filter modal

  const [showOpeningModal, setShowOpeningModal] = useState(false);

  const handleOpeningModal = () => {
    setShowOpeningModal(true);
  };



  // filter modal

  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };









  const columns = [
  

    {
      name: "Sr No",
      selector: (_: any,index:number) =>
    index+1,
      width: "5%",
    },
    {
      name: "Date",
      selector: (row: any) =>
       row.date,
      width: "10%",
    },
    {
      name: "Bill No",
      selector: (row: any) =>
        <>
        
        <button type="button" onClick={handleOpenBillModal}  className="text-[#009ce7] hover:text-blue-600 text-sm"> {row.billno}</button>
        </>,
      width: "10%",
    },
   
    {
      name: "Bill Type",
      selector: (row: any) =>
      <>
     {row.billtype}
      </>
      ,
      width: "15%",
    },
    {
      name: "Overdue",
      selector: (row: any) =>
      <>
     {row.overdue}
      </>
      ,
      width: "10%",
    },
    {
      name: "Dr.",
      selector: (row: any) =>
      <>
     {row.debit}
      </>
      ,
      width: "15%",
    },
    {
      name: "Cr.",
      selector: (row: any) =>
      <>
     {row.credit}
      </>
      ,
      width: "15%",
    },
    {
      name: "Balance",
      selector: (row: any) =>
      <>
     {row.balance} <span className="text-green-500">{row.balancein}</span>
      </>
      ,
      width: "20%",
    },
 
   



   
  ];

  // Sample data
  const data = [
    {
      
      date:"",
      billno:"",
      billtype:"Opening Balance",
      overdue:" ",
      debit:"184430.00 ",
      credit:"0.00 ",
      balance:"184430.00 ",
      balanceIn:"Dr.",
    },
    {
      
      date:"2024-10-30",
      billno:"000291",
      billtype:"Recieve on CHEQUE",
      overdue:" ",
      debit:"184430.00 ",
      credit:"0.00 ",
      balance:"184430.00 ",
      balanceIn:"Dr.",
    },
   
   
  
  ];


  // react select options
  const options = [
    {
      value:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
      label:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
    },
   
  ];



  return (
    <>
      <Breadcrumb
        pageTitle="GIRIRAJ KAILASH CHAND-CHANDANI CHOWK" // ledger name ayega dynamically data from the table
        pageCategory="Sales Ledger"
        activePage="9968304638 /
Credit Limit:
Outstanding: 11065.8 Dr. /
Overdue Bills: 1 /
GR Ratio: 90411 @100% /
Average Payment Days: 0 /
Net Sale: 0 
" // all data comes from the table row of the customerledger table
        addbuttn={true}
        withLink={false}
        previouspageurl="/all-ledger"
         additionaltext="Opening"
        excelbuttn={false}
        printbuttn={true}
        filterbuttn={true}
        handleOpenCreateModal={handleOpeningModal}
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

          {/* table total  */}

          <div className="flex justify-end">
            {/* Total */}
             <span className="w-[15%] px-2  text-secondarycolor font-semibold py-3 text-sm ">274841.00</span> <span className="w-[15%] px-2 text-sm  text-secondarycolor font-semibold py-3 ">263775.20</span> <span className="w-[20%] px-2  text-sm text-secondarycolor font-semibold py-3 ">11065.80</span>
          </div>
        </div>
      </div>



{/* bill payment details popup on click of the  bill no */}
  
 <>
        {showBillDetailsModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowBillDetailsModal(!showBillDetailsModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[50vh]  xl:w-[40rem] 3xl:w-[50rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
                Bill Payment Details
                </h4>
                <button type="button" onClick={() => setShowBillDetailsModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body p-4">
                {/* debit credit note details */}
                <div className="form_1 mb-3">
                  <div className="flex items-baseline">
                    <h5 className="text-[#2B3467] font-medium text-xl mb-3 flex items-center gap-2  ">
                    
                      Payment Details
                    </h5>
                    <div className="border border-[#ddd] w-[78%] ms-2"></div>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3 mb-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Receipt No
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
                          Paid Date
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
                          Invoice No
                        </label>
                       
                        <h6 className="text-secondarycolor font-medium text-sm">
                         
                        </h6>
                      </div>
                  
                    </div>

                    <div className="flex flex-wrap -mx-3 ">
                    <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                         Amount
                         
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                        
                        150553.22
                        </h6>
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Payment Mode
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
                          At
                        </label>

                        <h6 className="text-secondarycolor font-medium ">
                        16/05/2024 18:25:31
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="form_2 mb-3">
                  <div className="flex items-baseline">
                    <h5 className="text-[#2B3467] font-medium text-xl mb-3 flex items-center gap-2  ">
                    
                      Customer Details
                    </h5>
                    <div className="border border-[#ddd] w-[78%] ms-2"></div>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3 mb-3">
                      <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                       Company  Name
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                        
                        GIRIRAJ KAILASH CHAND-CHANDANI CHOWK
                        </h6>
                      </div>
                  
                      <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Customer Code
                        </label>
                   
                        <h6 className="text-secondarycolor font-medium text-sm">
                        CS-1314
                        </h6>
                      </div>
                  
                    </div>

                    <div className="flex flex-wrap -mx-3 ">
                    <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                         Mobile
                         
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                        
                        9045643351
                        </h6>
                      </div>
                      <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor  font-semibold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Address
                        </label>
                        <h6 className="text-secondarycolor font-medium text-sm">
                         
                        4653/ MAHAVIR BAZAR CLOTH MKT. Delhi Delhi - 110006
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

      {/* on click of add opening button of the page */}

       
    <>
        {showOpeningModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowOpeningModal(!showOpeningModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[37vh] xl:w-[40rem]  top-[25%]   inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
               + Add Opening Balance
                </h4>
                <button type="button" onClick={() => setShowOpeningModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body  p-4">
              <div className="flex mb-3">
                <div className="w-1/4 flex gap-2">
                <input type="radio" id="debitnote"
                 value="debitnote"
          checked={selectednote === 'debitnote'}
           onChange={()=>setSelectedNote("debitnote")}/>
                <label htmlFor="debitnote" className="text-sm">
                Debit Note
                </label>
               
                </div>
                <div className="w-1/4 flex gap-2">
                <input type="radio" id="creditnote"
                 value="creditnote"
                 checked={selectednote === 'creditnote'}
                 onChange={()=>setSelectedNote("creditnote")}/>
                <label htmlFor="creditnote" className="text-sm">
                Credit Note
                </label>
               
                </div>
            </div>

                <div className="flex flex-wrap -mx-3 mb-3">
               
          
                <div className="w-full px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                         Select Date 
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          placeholder=""
                          type="date"
                          onChange={(e) => setOpeningDate(new Date(e.target.value))}
                          value={moment(openingdate).format("YYYY-MM-DD")}
                        />
                      </div>
           

                </div>
                <div className="flex flex-wrap -mx-3 mb-3">
               
          
                <div className="w-full px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                         Opening Amount
                        </label>
                        <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none " id="grid-first-name" type="text" placeholder="Opening Amount " onChange={(e) => setOpeningAmount(e.target.value)} value={openingamount} />
                      </div>
           

                </div>
        

      
  
                <div className="w-full mt-3 ">
                  <button
                    type="button"
                    className="bg-txtcolor w-full text-white text-center py-[9px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Add Opening
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
              onClick={() => setShowFilterModal(!showFilterModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] xl:h-[50vh] 3xl:h-[52vh] xl:w-[40rem] 3xl:w-[45rem] xl:top-[20%]  3xl:top-[25%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
                <MdOutlineFilterAlt className="text-white" /> Select And Apply Filter
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
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
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
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          placeholder=""
                          type="date"
                          onChange={(e) => setEndDate(new Date(e.target.value))}
                          value={moment(enddate).format("YYYY-MM-DD")}
                        />
                      </div>

                </div>
                <div className="flex flex-wrap -mx-3 mb-3">
               
          
                <div className="w-full px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                         Company 
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
               styles={customReactStylesSmall1}
             />
                      </div>
             

                </div>

                <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-medium text-text15 mb-3"
                          htmlFor="grid-first-name"
                        >
                          Overdue Days 
                        </label>
                        <select onChange={(e) => setOverdueDays(e.target.value)} value={overduedays} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none  " defaultValue="Select">
                                        <option value="Select">Select</option>
                                        <option value="30+">30+</option>
                                        <option value="60+">60+</option>
                                        <option value="90+">90+</option>
                                        <option value="120+">120+</option>
                                        <option value="150+">150+</option>
                                        <option value="180+">180+</option>
                                    
                                    </select>
                      </div>
                      <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-medium text-text15 mb-3"
                          htmlFor="grid-first-name"
                        >
                          Payment Status 
                        </label>
                        <select onChange={(e) => setPaymentStatus(e.target.value)} value={paymentstatus} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none  " defaultValue="Select">
                                        <option value="Select">Select</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Unpaid">Unpaid</option>
                                       
                                    
                                    </select>
                      </div>
                    
                    </div>

                <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor font-medium text-text15 mb-3"
                          htmlFor="grid-first-name"
                        >
                         Bill Type
                        </label>
                        <select onChange={(e) => setBillType(e.target.value)} value={billtype} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none  " defaultValue="Select">
                                        <option value="Select">Select</option>
                                        <option value="Sales A/c">Sales A/c</option>
                                        <option value="Sales Return">Sales Return</option>
                                        <option value="Bank">Bank</option>
                                        <option value="Opening Balance">Opening Balance</option>
                                       
                                    
                                    </select>
                      </div>
                    
                    </div>
             

       
         
  
                <div className="w-full mt-3 ">
                  <button
                    type="button"
                    className="bg-txtcolor w-full text-white  py-[9px] text-text15 rounded-md hover:bg-secondarycolor"
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
