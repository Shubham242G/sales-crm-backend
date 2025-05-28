import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  FaFilter,
  FaFileExport,
  FaPlus,
  FaEdit,
  FaTrash,
  FaColumns,
} from "react-icons/fa";
import {
  useConfirmedQuotes,
  usedeleteConfirmedQuotesById,
} from "@/services/confirmedQuotesFromVendor.service";
import { toastError, toastSuccess } from "@/utils/toast";
import moment from "moment";
import { Switch } from "@mui/material";
import { checkPermissionsForButtons } from "@/utils/permission";
import { FiEdit } from "react-icons/fi";

function ConfirmedQuotesFromVendor() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );
  const { data: confirmedQuotesToVendorData, refetch } =
    useConfirmedQuotes(searchObj);
  const { mutateAsync: deleteConfirmedQuote } = usedeleteConfirmedQuotesById();

 const [isOpenAction, setIsOpenAction] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { data: res } = await deleteConfirmedQuote(id);
      toastSuccess(res.message || "Confirmed Quote deleted successfully");
      refetch();
    } catch (error) {
      toastError(error);
    }
  };

  const columns = [
    {
      name: "Quotes Id",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col ">
          <h6>{row.banquetEventOrders?.quotesId || "N/A"}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Vendor Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.banquetEventOrders?.vendorList?.label || "N/A"}</h6>
        </div>
      ),
      width: "15%", // Adjusted width to accommodate content
    },
    {
      name: "RPFs Id",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col ">
          <h6>{row.banquetEventOrders?.rfpId || "N/A"}</h6>
        </div>
      ),
      width: "13%",
    },
    {
      name: "Amount",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col ">
          <h6>{row.banquetEventOrders?.amount || "N/A"}</h6>
        </div>
      ),
      width: "12%",
    },
    {
      name: "Date Received",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col ">
          <h6>
            {row.banquetEventOrders?.receivedDate
              ? moment(row.banquetEventOrders.receivedDate).format("DD-MM-YYYY")
              : "N/A"}
          </h6>
        </div>
      ),
      width: "15%", // Adjusted width for better spacing
    },
    {
      name: "Status",
      selector: (row: any) => (
        <div
          className={`flex gap-1 flex-col px-2 py-1 text-xs rounded-md text-white ${
            row.banquetEventOrders?.status === "Pending"
              ? "bg-yellow-200 text-yellow-500"
              : row.banquetEventOrders?.status === "Completed"
              ? "bg-green-300 text-green-600"
              : row.banquetEventOrders?.status === "Rejected"
              ? "bg-red-200 text-red-600"
              : "bg-gray-700 "
          }`}
        >
          <h6 className="text-xs">{row.banquetEventOrders?.status || "N/A"}</h6>
        </div>
      ),
      width: "130px", 
    },
    // {
    //   name: "Edit",
    //   width: "10%",
    //   selector: (row: any) => (
    //     <button
    //       type="button"
    //       onClick={() => navigate(`/add-ConfirmedQuotesFromVendor/${row._id}`)}
    //       className="text-lg  hover:bg-blue-100 rounded-full transition duration-200 "
    //     >
    //        <FaEye className=" hover:text-orange-500 text-sm"/>
    //     </button>
    //   ),
    // },
    // {
    //   name: "Delete",
    //   width: "10%",
    //   selector: (row: any) => (
    //     <button
    //       type="button"
    //       onClick={() => handleDelete(row._id)}
    //       className=" text-lg  hover:bg-red-100 rounded-full transition duration-200"
    //     >
    //      <RiDeleteBin6Line className="hover:text-red-500 text-sm" />
    //     </button>
    //   ),
    // },

    {
         name: "Actions",
         width: "20px",
         selector: (row: any) => (
           <div className="">
             <button
               type="button"
               
               title="More Actions"
               onClick={(e) =>{ setIsOpenAction(selectedRowId === row._id ? !isOpenAction : true),setSelectedRowId(row._id )}}
             >
               <span className="flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,1)"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path></svg></span>
             </button>
             { selectedRowId === row._id   &&  (isOpenAction) && (
               <div className="absolute bg-white z-10 shadow-lg rounded-md overflow-hidden -ml-10 border">
   
                 <Link
                   to={`/add-vendor/${row?._id}`}
                   className="flex items-center text-gray-600 hover:bg-blue-500 hover:text-white px-4 border-b py-2 gap-2"
                   title="View Vendor"
                 >
                   <FiEdit className="text-xs" />
                   Edit
                 </Link>
                 <button
                   type="button"
                   onClick={() => handleDelete(row._id)}
                   className="flex items-center  text-gray-600 hover:bg-blue-500 hover:text-white px-4 border-b py-2 gap-2"
                   title="Delete Vendor"
                 >
                   <RiDeleteBin6Line className="text-xs" />
                   Delete
                 </button>
               </div>
             )}
           </div>
         ),
       },





  ];

  // Sample data
  const data = [
    {
      quotesId: "QUT126789",
      amount: "500000",
      rpfId: "RPF123456",
      name: "Ajay Kumar",
      submissionDate: "27-10-2024",
      status: "Pending",
      service: [
        { name: "hotel" },
        { name: "banquet" },
        { name: "Event" },
        { name: "Transport" },
      ],
    },
    {
      quotesId: "QUT126789",
      amount: "500000",
      rpfId: "RPF123456",
      name: "Ajay Kumar",
      submissionDate: "27-10-2024",
      status: "Rejected",
      service: [
        { name: "hotel" },
        { name: "banquet" },
        { name: "Event" },
        { name: "Transport" },
      ],
    },
    {
      quotesId: "QUT126789",
      amount: "500000",
      rpfId: "RPF123456",
      name: "Ajay Kumar",
      submissionDate: "27-10-2024",
      status: "Reviewed",
      service: [
        { name: "hotel" },
        { name: "banquet" },
        { name: "Event" },
        { name: "Transport" },
      ],
    },
    {
      quotesId: "QUT126789",
      amount: "500000",
      rpfId: "RPF123456",
      name: "Ajay Kumar",
      submissionDate: "27-10-2024",
      status: "Pending",
      service: [
        { name: "hotel" },
        { name: "banquet" },
        { name: "Event" },
        { name: "Transport" },
      ],
    },
    {
      quotesId: "QUT126789",
      amount: "500000",
      rpfId: "RPF123456",
      name: "Ajay Kumar",
      submissionDate: "27-10-2024",
      status: "Rejected",
      service: [
        { name: "hotel" },
        { name: "banquet" },
        { name: "Event" },
        { name: "Transport" },
      ],
    },
    {
      quotesId: "QUT126789",
      amount: "500000",
      rpfId: "RPF123456",
      name: "Ajay Kumar",
      submissionDate: "27-10-2024",
      status: "Reviewed",
      service: [
        { name: "hotel" },
        { name: "banquet" },
        { name: "Event" },
        { name: "Transport" },
      ],
    },
  ];

   const {canCreate, canView, canUpdate, canDelete} = checkPermissionsForButtons("Confirmed Quotes From Vendors");
 // Column selector
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    // Toggle column visibility
    const [visibleColumns, setVisibleColumns] = useState({
       "Quotes Id": true,
      "Vendor Name": true,
      "RPFs Id": true,
      "Amount": true,
      "Date Received": true,
      "Status": true,
     Actions : true,
    }); 
    useEffect(() => {
      const savedColumns = localStorage.getItem('enquiryTableColumnsConfirmQuotesFromVendor');
      if (savedColumns) {
        setVisibleColumns(JSON.parse(savedColumns));
      }
    }, []);
  
    useEffect(() => {
      if(canView !==undefined){
      localStorage.setItem('enquiryTableColumnsConfirmQuotesFromVendor', JSON.stringify(visibleColumns));
      }

    }, [visibleColumns, canView]);
    const toggleColumnVisibility = (columnName: string) => {
      setVisibleColumns(prev => ({
        ...prev,
        [columnName as keyof typeof prev]: !prev[columnName as keyof typeof prev]
      }));
    };
    const ColumnSelector = () => (
      <div className="absolute bg-white shadow-lg p-4 rounded-md mt-2 z-10 border border-gray-200 right-0 w-72">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h3 className="font-medium">Customize Columns</h3>
            <button 
              className="text-xs text-blue-600 hover:underline"
              onClick={resetColumnVisibility}
            >
              Reset to Default
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {columns.map((column) => (
              <div key={column.name} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm">{column.name}</span>
                <Switch
                  checked={visibleColumns[column.name as keyof typeof visibleColumns] || false}
                  onChange={() => toggleColumnVisibility(column.name)}
                  size="small"
                  color="primary"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-2 flex justify-end">
            <button 
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              onClick={() => setShowColumnSelector(false)}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
    
      const calculateDynamicWidths = (columnsArray: any[]) => {
      const visibleColumnsCount = columnsArray.length;
      
      if (visibleColumnsCount === 0) return columnsArray;
      
      const columnsWithDynamicWidth = columnsArray.map(column => ({...column}));
      
      const baseWidth = 100 / visibleColumnsCount; 
  
      const MIN_WIDTH = 8; 
      const MAX_WIDTH = 20; 
  
      columnsWithDynamicWidth.forEach(column => {
        let allocatedWidth = baseWidth;
  
        // Columns that typically need less space
        if (column.name === "Delete" || column.name === "Edit") {
          allocatedWidth = Math.max(MIN_WIDTH, baseWidth);
        }
        // Columns that might need more space
        else if (column.name === "Customer Name" || column.name === "Level of Enquiry") {
          allocatedWidth = Math.min(MAX_WIDTH, baseWidth);
        }
  
        column.width = `${allocatedWidth}%`;
      });
  
      console.log(columnsWithDynamicWidth, "check the column width")
      
      return columnsWithDynamicWidth;
    };
  
    // Filter columns based on visibility
    const visibleColumnsArray = columns.filter(column => 
      visibleColumns[column.name as keyof typeof visibleColumns]
    );
    
    // Apply dynamic widths to visible columns
    const filteredColumns = calculateDynamicWidths(visibleColumnsArray);
  
    const resetColumnVisibility = () => {
      setVisibleColumns({
      "Quotes Id": true,
      "Vendor Name": true,
      "RPFs Id": true,
      "Amount": true,
      "Date Received": true,
      "Status": true,
     Actions : true,
     
      });
    };



  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setQuery(e.target.value);
  //   setPageIndex(1);
  // };

  return (
    <>
      {/* <Breadcrumb
        pageTitle="Customer Ledger"
        pageCategory="All Ledger"
        activePage="All Customer Ledger"
        previouspageurl="/"
        addbuttn={true}
        withLink={true}
        addbuttnurl="/add-ledger"
        excelbuttn={false}
        filterbuttn={false}
      /> */}

     
        <div className="h-[90vh]  mt-16 p-6 overflow-y-auto">
          <div className="search_boxes flex justify-between items-center ">
            {/* Heading on the Left */}
            <h2 className="text-xl font-semibold text-gray-800">
              All Quotes for Vendor List
            </h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full">
                <input
                  type="search"
                  className="rounded-md w-full border px-3 border-gray-300 py-1.5 text-sm  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search..."
                  // value={query}
                  // onChange={handleSearchChange}
                />
              </div>
              <div className="relative">
                            <button
                              className="flex items-center gap-1 text-sm  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                              onClick={() => setShowColumnSelector(!showColumnSelector)}
                            >
                              <FaColumns /> Columns
                            </button>
                            {showColumnSelector && <ColumnSelector />}
                          </div>


              {/* Buttons */}
              {/* <button className="flex items-center gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button> */}
              <button className="flex items-center gap-1  px-3 py-1.5 text-sm rounded-md text-gray-700 border border-gray-300">
                <FaFileExport /> Export
              </button>
              <button
                onClick={() => navigate("/add-ConfirmedQuotesFromVendor")}
                className="flex w-full items-center justify-center gap-1 px-3 text-sm py-1.5 text-white rounded-md bg-orange-500 border border-gray-300"
              >
                <FaPlus />
                <span className="text-sm">New Confirmed Quotes</span>
              </button>
              {/* <button className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300">
                <FaPlus />
                <span>New RFPs</span>
              </button> */}
            </div>
          </div>

          {/* React Table */}
          <div className=" mt-5">
            <ReactTable
            data={confirmedQuotesToVendorData.data}
             columns={filteredColumns}
            loading={false}
            totalRows={confirmedQuotesToVendorData?.total}
            onChangeRowsPerPage={setPageSize}
            onChangePage={setPageIndex}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
          />
          </div>
          
        </div>
     
    </>
  );
}

export default ConfirmedQuotesFromVendor;
