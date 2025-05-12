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
          className={`flex gap-1 flex-col p-2 rounded-md text-white ${
            row.banquetEventOrders?.status === "Pending"
              ? "bg-yellow-200 text-yellow-500"
              : row.banquetEventOrders?.status === "Completed"
              ? "bg-green-300 text-green-600"
              : row.banquetEventOrders?.status === "Rejected"
              ? "bg-red-200 text-red-600"
              : "bg-gray-700 "
          }`}
        >
          <h6>{row.banquetEventOrders?.status || "N/A"}</h6>
        </div>
      ),
      width: "130px",
    },
    {
      name: "Edit",
      width: "10%",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => navigate(`/add-ConfirmedQuotesFromVendor/${row._id}`)}
          className="text-lg  hover:bg-blue-100 rounded-full transition duration-200 "
        >
           <FaEye className=" hover:text-orange-500"/>
        </button>
      ),
    },
    {
      name: "Delete",
      width: "10%",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => handleDelete(row._id)}
          className=" text-lg  hover:bg-red-100 rounded-full transition duration-200"
        >
         <RiDeleteBin6Line className="hover:text-red-500" />
        </button>
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
 // Column selector
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    // Toggle column visibility
    const [visibleColumns, setVisibleColumns] = useState({
      "Quotes ID": true,
      "Submission Date": true,
      "RFP ID": true,
      "Name": true,
      "Amount": true,
      "Services": true,
      "Status": true,
      "Edit": true, 
      "Delete": true, 
      "Convert to Quotes from Vendor": true
    }); 
    useEffect(() => {
      const savedColumns = localStorage.getItem('enquiryTableColumns');
      if (savedColumns) {
        setVisibleColumns(JSON.parse(savedColumns));
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('enquiryTableColumns', JSON.stringify(visibleColumns));
    }, [visibleColumns]);
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
        "Quotes ID": true,
      "Submission Date": true,
      "RFP ID": true,
      "Name": true,
      "Amount": true,
      "Services": true,
      "Status": true,
      "Edit": true, 
      "Delete": true, 
      "Convert to Quotes from Vendor": true
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

      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
          <div className="search_boxes flex justify-between items-center">
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
                  className="rounded-md w-full border px-4 border-gray-300 py-2  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search..."
                  // value={query}
                  // onChange={handleSearchChange}
                />
              </div>
              <div className="relative">
                            <button
                              className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                              onClick={() => setShowColumnSelector(!showColumnSelector)}
                            >
                              <FaColumns /> Columns
                            </button>
                            {showColumnSelector && <ColumnSelector />}
                          </div>


              {/* Buttons */}
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button>
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFileExport /> Export
              </button>
              <button
                onClick={() => navigate("/add-ConfirmedQuotesFromVendor")}
                className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
              >
                <FaPlus />
                <span>New Confirmed Quotes</span>
              </button>
              {/* <button className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300">
                <FaPlus />
                <span>New RFPs</span>
              </button> */}
            </div>
          </div>

          {/* React Table */}
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
