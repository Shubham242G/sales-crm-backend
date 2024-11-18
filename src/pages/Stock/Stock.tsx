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

import imageicon from '../../assets/table/imageicn.png'

export default function Stock() {
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
      name: " ",
      selector: (row: any) => 
        <>
        <input type="checkbox" value={row.tablecheck} 
        // onChange={(e)=>setTableCheck(e.target.value)}
         />
        </>
        ,
      width: "3%",
    },
    {
      name: "Image",
      selector: () => 
        
        <img src={imageicon} alt="imageicon" className="w-[26px] h-[26px]" />
        
        ,
      width: "4%",
    },

    {
      name: "Category",
      selector: (row: any) => 
        <>
        <h6 className="text-wrap text-[0.75rem]">
          {row.category}
        </h6>
        </>
        ,
      width: "10%",
    },
    {
      name: "SubCategory",
      selector: (row: any) => row.subcategory,
      width: "10%",
    },
    {
      name: "Brand",
      selector: (row: any) => row.brand,
      width: "10%",
    },
    {
      name: "Product",
      selector: (row: any) => row.product,
      width: "10%",
    },

    {
      name: "Barcode",
      selector: (row: any) =>
       row.barcode,
      width: "9%",
    },
    {
      name: "HSN",
      selector: (row: any) =>
       row.hsncode,
      width: "8%",
    },
    {
      name: "Purchase",
      selector: (row: any) =>
       row.purchase,
      width: "10%",
    },
    {
      name: "MRP",
      selector: (row: any) =>
       row.mrp,
      width: "8%",
    },
    {
      name: "Sale",
      selector: (row: any) =>
       row.sale,
      width: "8%",
    },
    {
      name: "Stock",
      selector: (row: any) =>
      <>
      <Link to="" className="text-blue-500"> {row.stock}</Link>
      </>,
      width: "4%",
    },



    {
      name: "Action",
      width: "6%",
      selector: () => (
        <div className="flex items-center gap-3">
              <Link to="/update-product" className="text-[#26af48] bg-[#0fb76b1f] p-2 text-[1.1rem]">
            <FiEdit />
          </Link>
   
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
      tablecheck:true,
      image:imageicon,
      category:"BRIDAL LEHENGAS",
      subcategory:"BRIDAL LEHENGAS",
      brand: "AGAM CREATION",
      product: "AGM-989",
      barcode: "6001149430",
      hsncode: "630790",
      purchase:"9550",
      mrp:"14688",
      sale:"11938",
      stock:"0",
     
    
   
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

  const supplieroptions = [
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },
    { value: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK", label: "(SP-105) AAKARSHAN BOUTIQUE PVT LTD  - Delhi - CHANDANI CHOWK" },

  ];
  const categoryoptions = [
    { value: "Banarasi Sarees", label: "Banarasi Sarees" },
    { value: "Banarasi Sarees", label: "Banarasi Sarees" },
    { value: "Banarasi Sarees", label: "Banarasi Sarees" },
    { value: "Banarasi Sarees", label: "Banarasi Sarees" },
  
  
  ];
  const brandoptions = [
    { value: "Aabhaar Vastram", label: "Aabhaar Vastram" },
    { value: "Aabhaar Vastram", label: "Aabhaar Vastram" },
    { value: "Aabhaar Vastram", label: "Aabhaar Vastram" },
    { value: "Aabhaar Vastram", label: "Aabhaar Vastram" },
    { value: "Aabhaar Vastram", label: "Aabhaar Vastram" },
   
  
  
  ];
  const HSNoptions = [
    { value: "324389", label: "324389" },
    { value: "324389", label: "324389" },
    { value: "324389", label: "324389" },
    { value: "324389", label: "324389" },
  
   
  
  
  ];



  return (
    <>
      <Breadcrumb
        pageTitle="Product"
        pageCategory="Dashboard"
        activePage="All Product"
        addbuttn={true}
        withLink={true}
        previouspageurl="/stock"
         addbuttnurl="/stock-report-list"
         additionaltext=""
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
                className="rounded-sm w-full border border-buttnhover p-2  focus:outline-none focus:border-buttnhover"
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
                className="rounded-sm w-full border border-buttnhover p-2  placeholder-txtcolor focus:outline-none focus:border-buttnhover"
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
              onClick={() => setShowFilterModal(!showFilterModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[44vh] xl:w-[40rem] 3xl:w-[50rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
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
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Party
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
                      Category
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={categoryoptions[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={categoryoptions}
                      styles={customReactStylesSmall}
                    />
                  </div>
               

                </div>
                <div className="flex flex-wrap -mx-3 mb-3">
               
       
                <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                     Sub Category
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={categoryoptions[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={categoryoptions}
                      styles={customReactStylesSmall}
                    />
                  </div>

                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Brand
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={brandoptions[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={brandoptions}
                      styles={customReactStylesSmall}
                    />
                  </div>
               

                </div>
                <div className="flex flex-wrap -mx-3 mb-3">
               
       
                <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                     HSN Code
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={HSNoptions[0]}
                      isDisabled={isDisabled}
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isRtl={isRtl}
                      isSearchable={isSearchable}
                      name="color"
                      options={HSNoptions}
                      styles={customReactStylesSmall}
                    />
                  </div>

                
               

                </div>

       
         
  
                <div className="w-full mt-3 flex justify-between">
                  <button
                    type="submit"
                    className="bg-txtcolor w-[14%] text-white  py-[9px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Apply Filter
                  </button>
                  <button
                    type="submit"
                    className="bg-red-500 w-[10%] text-white  py-[10px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Clear
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
