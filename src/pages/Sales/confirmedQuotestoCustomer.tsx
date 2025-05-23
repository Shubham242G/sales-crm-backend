import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaColumns } from "react-icons/fa";
import { Switch } from "@mui/material";

function ConfirmedQuotestoCustomer() {
  const navigate = useNavigate();


  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

   const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const columns = [
     {
      name: '',

      //   <input
      //     type="checkbox"
      //     onChange={(e) => {
      //       const isChecked = e.target.checked;
      //       if (isChecked) {
      //         setSelectedRows(leadData.data.map((row:any) => row._id));
      //       } else {
      //         setSelectedRows([]);
      //       }
      //     }}
      //   />


      cell: (row: any) => (
        <div className="ml-10 scale-75"><input
          type="checkbox"
          checked={selectedRows.includes(row._id)}

          onChange={() => {
            if (selectedRows.includes(row._id)) {
              setSelectedRows(selectedRows.filter((id) => id !== row._id));
            } else {
              setSelectedRows([...selectedRows, row._id]);
            }
          }}
        />
        
        </div>

      ),
      width: "60px",
      fixed: true
    },
    {
      name: "Quotes Id",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.quotesId}</h6>
        </div>
      ),
      width: "200px",
    },
    {
      name: "Vendor Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.name}</h6>
        </div>
      ),
     width: "200px",
    },
    {
      name: "RPFs Id",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.rpfId}</h6>
        </div>
      ),
         width: "200px",
    },
    {
      name: "Service",
      selector: (row: any) => (
        <>
          <div className="flex flex-wrap justify-around">
            {row.service.map((e: any, index: number) => (
              <div
                key={index}
                className="bg-purple-100 text-purple-800 text-sm px-3 py-1 mb-1 rounded-full border border-purple-300 shadow-sm"
              >
                {e.name}
              </div>
            ))}
          </div>
        </>
      ),
        width: "200px",
    },
    {
      name: "Amount",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.amount}</h6>
        </div>
      ),
         width: "200px",
    },
    {
      name: "Date Received",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.submissionDate}</h6>
        </div>
      ),
        width: "200px",
    },
    {
      name: "Status",
      selector: (row: any) => (
        <div
          className={`flex gap-1 flex-col p-2 rounded-md text-white ${row.status === "Pending"
              ? "bg-yellow-300 text-yellow-900"
              : row.status === "Reviewed"
                ? "bg-green-500 text-green-600"
                : "bg-red-500 text-white-100"
            }`}
        >
          <h6>{row.status}</h6>
        </div>
      ),
        width: "200px",
    },

    {
      name: "Action",
         width: "200px",
      selector: () => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/confirmedQuotesView")}
            className=" text-black-500 text-lg p-[6px]"
          >
            <FaEye className=" hover:text-orange-500" />
          </button>
          {/* <Link
            to="/update-ledger/id=1234"
            className=" bg-[#0fb76b1f] p-[6px] text-green-400 text-lg"
          >
            <RiDeleteBin6Line />
          </Link> */}
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

  // Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  // Define permissions (replace with actual logic or values)
  const canView = true; // Example: Replace with actual permission logic
  const canUpdate = true; // Example: Replace with actual permission logic
  const canDelete = true; // Example: Replace with actual permission logic

  const [visibleColumns, setVisibleColumns] = useState({
    "Quotes Id": true,
    "Vendor Name": true,
    "RPFs Id": true,
    "Service": true,
    "Amount": true,
    "Date Received": true,
    "Status": true,
    "Action": canView || canUpdate || canDelete,

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

    const columnsWithDynamicWidth = columnsArray.map(column => ({ ...column }));

    const baseWidth = 100 / visibleColumnsCount;

    const MIN_WIDTH = 8;
    const MAX_WIDTH = 20;

   const calculateFixedWidths = (columnsArray: any[]) => {
    const totalWidth = columnsArray.length > 0 ? columnsArray.length * 180 : 1;
    const containerWidth = window.innerWidth - 100; // Adjust for padding/margins
    const columnsWithFixedWidth = columnsArray.map(column => ({
      ...column,
      width: totalWidth > containerWidth ? "180px" : `${100 / columnsArray.length}%`
    }));

    console.log(columnsWithFixedWidth, "check the column width");

    return columnsWithFixedWidth;
  };

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
      "Service": true,
      "Amount": true,
      "Date Received": true,
      "Status": true,
      "Action": canView || canUpdate || canDelete,
    });
  };

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

      <div className="container  -ml-5 -mt-6">
        <div className=" table_container rounded-xl shadow-xl    -mt-5">
          <div className="search_boxes flex justify-between items-center">
            {/* Heading on the Left */}
            <h2 className="text-xl font-semibold text-gray-800 ml-3">
              All Quotes for Vendor List
            </h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full">
                <input
                  type="search"
                  className="rounded-md w-full border px-3 text-sm border-gray-300 py-1.5   text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search..."
                />
              </div>
              <div className="relative">
                <button
                  className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
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
              <button className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
                <FaFileExport /> Export
              </button>
              <button
                onClick={() => navigate("/add-ConfirmedQuotesFromVendor")}
                className="flex w-full items-center justify-center gap-1 px-3 text-sm py-1.5 text-white rounded-md bg-orange-500 border border-gray-300"
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
          <div className="mt-3 -mr-4">
  <ReactTable
            data={data}
            columns={filteredColumns}
            loading={false}
            totalRows={0}
          // onChangePage={handlePageChange}
          // onChangeRowsPerPage={handleRowsPerPageChange}
          // pagination
          // paginationPerPage={rowsPerPage}
          // paginationRowsPerPageOptions={[5, 10, 20]}
          />
          </div>
        
        </div>
      </div>
    </>
  );
}

export default ConfirmedQuotestoCustomer;
