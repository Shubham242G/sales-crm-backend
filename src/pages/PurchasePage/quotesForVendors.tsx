import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaColumns } from "react-icons/fa";
import { SiConvertio } from "react-icons/si";
import {
  useConvertQuotesFromVendorToQuotesToCustomer,
  useQuotesFromVendors,
  useQuotesFromVendorsById,
  usedeleteQuotesFromVendorsById,
} from "@/services/quotesFromVendors.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { Switch } from "@mui/material";

function CustomerLedger() {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const { data: quotesFromVendors, isLoading, refetch } = useQuotesFromVendors(searchObj);



  const { mutateAsync: convertQuotesFromVendorToQuotesToCustomer } =
    useConvertQuotesFromVendorToQuotesToCustomer();

  const { mutateAsync: deleteQuotesFromVendors } =
    usedeleteQuotesFromVendorsById();

  const navigate = useNavigate();

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this Quote?")) {
        const { data: res } = await deleteQuotesFromVendors(id);
        if (res) {
          toastSuccess(res.message);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleConvertToCustomerQuote = async (id: string) => {
    try {
      const { data: res } = await convertQuotesFromVendorToQuotesToCustomer(id);
      if (res?.message) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError("Failed to convert quote.");
    }
  };

  const columns = [
    {
      name: "Quotes Id",
      selector: (row: any) => <h6>{row?.quotesId}</h6>,
      width: "110px",
    },
    {
      name: "Vendor Name",
      selector: (row: any) => <h6>{row?.vendorList?.label}</h6>,
      width: "130px",
    },
    {
      name: "Display Name",
      selector: (row: any) => <h6>{row?.displayName}</h6>,
      width: "10%",
    },
    {
      name: "RPFs Id",
      selector: (row: any) => <h6>{row?.rfpId}</h6>,
      width: "130px",
    },
    {
      name: "Status",
      selector: (row: any) => <h6 className="" > {row?.status}</h6>,
      width: "150px",
    },
    {
      name: "Service",
      selector: (row: any) => (
        <div className="flex flex-wrap justify-around">
          {row?.serviceType?.map((e: any, index: number) => (
            <div
              key={index}
              className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full border mb-1 border-purple-300 shadow-sm"
            >
              {e}
            </div>
          ))}
        </div>
      ),
      width: "190px",
    },
    {
      name: "Amount",
      selector: (row: any) => <h6>{row?.amount}</h6>,
      width: "150px",
    },
    {
      name: "Date Received",
      selector: (row: any) => <h6>{row?.receivedDate}</h6>,
      width: "150px",
    },
    // {
    //   name: "Status",
    //   selector: (row: any) => (
    //     <div
    //       className={`p-2 rounded-md text-white ${
    //         row.status === "Pending"
    //           ? "bg-yellow-200 text-yellow-500"
    //           : row.status === "Reviewed"
    //           ? "bg-green-300 text-green-600"
    //           : "bg-red-200 text-red-600"
    //       }`}
    //     >
    //       <h6>{row?.status}</h6>
    //     </div>
    //   ),
    //   width: "12%",
    // },
    {
      name: "Action",
      width: "150px",
      selector: (row: any) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/addQuotesFromVendors/${row._id}`}
            className=" p-[3px] text-black-400 text-lg  hover:text-orange-500"
          >
            <FaEye />
          </Link>
          <button
            className=" text-black-400 text-lg "
            onClick={() => handleDelete(row._id)}
          >
            <RiDeleteBin6Line className="hover:text-red-500" />
          </button>
        </div>
      ),
    },
    {
      name: "Convert to Customer Quote",
      width: "150px", selector: (row: any) => (
        <div>
          <button
            type="button"
            onClick={() => handleConvertToCustomerQuote(row._id)}
            className="text-lg text-black-400 hover:text-black-700 "
            title="Convert to Customer Quote"
          >
            <SiConvertio />
          </button>
        </div>
      ),
    },
  ];

  // Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    "Quotes Id": true,
    "Vendor Name": true,
    "Display Name": true,
    "RPFs Id": true,
    "Status": true,
    "Service": true,
    "Amount": true,
    "Date Received": true,
    "Action": true,
    "Convert to Customer Quote": true
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
      "Display Name": true,
      "RPFs Id": true,
      "Status": true,
      "Service": true,
      "Amount": true,
      "Date Received": true,
      "Action": true,
      "Convert to Customer Quote": true
    });
  };

  return (
    <div className="container px-6">
      <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
        <div className="search_boxes flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Quotes from Vendor
          </h2>
          <div className="flex items-center justify-start gap-2">
            <div className="w-full">
              <input
                type="search"
                className="rounded-md w-full border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
                value={query}
                  onChange={handleSearchInput}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      refetch();
                    }
                  }}
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
            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFilter /> Filter
            </button>
            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFileExport /> Export
            </button>
            <button
              onClick={() => navigate("/addQuotesFromVendors")}
              className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
            >
              <FaPlus />
              <span>New quotes for vendors</span>
            </button>
          </div>
        </div>
        <ReactTable
          data={quotesFromVendors.data}
          columns={filteredColumns}
          loading={false}
          totalRows={0}
          onChangeRowsPerPage={setPageSize}
          onChangePage={setPageIndex}
          page={pageIndex}
          rowsPerPageText={pageSize}
          isServerPropsDisabled={false}
        />
      </div>
    </div>
  );
}

export default CustomerLedger;