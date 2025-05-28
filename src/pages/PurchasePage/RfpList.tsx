import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaColumns } from "react-icons/fa";

import {
  useRfp,
  usedeleteRfpById,
  useAddRfp,
  useUpdateRfpById,
  useConvertRfpToQuotesFromVendor,
} from "@/services/rfp.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { SiConvertio } from "react-icons/si";
import { Margin } from "@mui/icons-material";
import { l } from "vite/dist/node/types.d-aGj9QkWt";
import { Switch } from "@mui/material";
import { FiEdit } from "react-icons/fi";

function RfpList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [leadId, setLeadId] = useState("");
  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };
  const { mutateAsync: convertRfp } = useConvertRfpToQuotesFromVendor();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  // const {data: useEnquiryByIdData} = useEnquiryById(enquiryId);

  const { data: RfpData, isLoading, refetch } = useRfp(searchObj);
  const { mutateAsync: deleteRfp } = usedeleteRfpById();
  const { mutateAsync: updateRfp } = useUpdateRfpById();

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("RFPS");

  const handleUpdate = async (id: string, data: any) => {
    try {
      const { data: res } = await updateRfp({
        id: id,
        obj: data, // Add the required object data here
      });
      if (res) {
        toastSuccess(res.message);
        // Optionally refresh the data
      }
    } catch (error) {
      toastError(error);
    }
  };

  // Handle file selection and upload
  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     setIsUploading(true);
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const response = await addEnquiryExel(formData);

  //     console.log(response, "check response")
  //     toastSuccess("Enquries imported successfully!");

  //     // Optionally refresh the data
  //     // You might want to add a refetch function from your useContact hook

  //   } catch (error) {
  //     toastError("Failed to import enquiries. Please try again.");
  //     console.error("Import Error:", error);
  //   } finally {
  //     setIsUploading(false);
  //     // Clear the file input
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = '';
  //     }
  //   }
  // };

  // Handle Export Contacts
  // const handleExportEnquiries = async () => {
  //   try {
  //     const { data: response } = await getExel();
  //     console.log(response, "check response")
  //     const url = generateFilePath("/" + response.filename);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "enquiries.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     toastSuccess("Enquries exported successfully!");
  //   } catch (error) {
  //     toastError("Failed to export enquiries. Please try again.");
  //     console.error("Export Error:", error);
  //   }
  // };

  //

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleConvertRfptoQuotesFromVendor = async (id: string) => {
    try {
      const { data: res } = await convertRfp(id);
      toastSuccess(res.message);
    } catch (error: any) {
      toastError(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this enquiry?")) {
        const { data: res } = await deleteRfp(id);
        if (res) {
          toastSuccess(res.message);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };
  const [isOpenAction, setIsOpenAction] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  

  const columns = [
    {
      name: "RFPID",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col ">
          <h6>{row.rfpId}</h6>
        </div>
      ),
      width: "10%",
    },
    // {
    //   name: "Full Name",
    //   selector: (row: any) => (
    //     <div className="flex gap-1 flex-col">
    //       <h6>{row?.fullName}</h6>
    //       {/* {row.fullName} */}
    //     </div>
    //   ),
    //   width: "10%",
    // },
    {
      name: "Event Date",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">

          <h6>
            {row.eventDates?.length > 0
              ? new Date(row.eventDates[0].startDate).toDateString()
              : "No Dates"}
          </h6>
        </div>
      ),
      width: "13%",
    },
    {
      name: "Deadline for proposal",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{new Date(row?.
            deadlineOfProposal).toDateString()}</h6>
          {/* {row.fullName} */}
        </div>
      ),
      width: "12%",
    },
    {
      name: "Services",
      selector: (row: any) => (
        <div className="flex flex-wrap justify-around gap-1">
          {row.serviceType.length > 0 &&
            row.serviceType.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-sky-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-sky-300 shadow-sm"
              >
                {item}
              </div>
            ))}
        </div>
      ),
      width: "16%",


    },
    {
      name: "Display Name",
      selector: (row: any) => (
        <div className="flex  justify-around  "><h6 className="whitespace-normal break-words">{row.displayName}</h6></div>
      ),
      width: "20%",
    },

    {
      name: "Status",
      selector: (row: any) => (
        <div className="flex  justify-around  "><h6 className="whitespace-normal break-words">{row.status}</h6></div>
      ),
      width: "20%",
    },
    {
      name: "Actions",
      width: "50px",
      selector: (row: any) => (
        <div className="">
          <button
            type="button"
            title="More Actions"
            onClick={(e) => {
              setIsOpenAction(selectedRowId === row._id ? !isOpenAction : true);
              setSelectedRowId(row._id);
            }}
          >
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="rgba(255,255,255,1)"
              >
                <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
              </svg>
            </span>
          </button>
          {selectedRowId === row._id && isOpenAction && (
            <div className="absolute bg-white z-10 shadow-lg rounded-md overflow-hidden border">
              <Link
                to={`/add-rfps/${row?._id}`}
                className="flex items-center text-gray-600 hover:bg-blue-500 hover:text-white px-4 border-b py-2 gap-2"
                title="View RFP"
              >
                <FiEdit className="text-xs" />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(row._id)}
                className="flex items-center  text-gray-600 hover:bg-blue-500 hover:text-white px-4 border-b py-2 gap-2"
                title="Delete RFP"
              >
                <RiDeleteBin6Line className="text-xs" />
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Convert to Quotes from Vendor",
      width: "15%",
      selector: (row: any) => (
        <div className="flex items-center ">
          <Link
            to={`/add-sales-contact/${row?._id}`}
            className="text-black-400 text-sm flex items-center"
          ></Link>
          <button
            className="  text-black-400 text-sm"
            onClick={() => handleConvertRfptoQuotesFromVendor(row._id)}
          >
            <SiConvertio />
          </button>
        </div>
      ),
    },
  ];

  const filterColumns = columns.filter((item) => {
    if (item.name === "Delete") {
      return canDelete;
    } else if (item.name === "Edit") {
      return canView || (canView && canUpdate);
    } else {
      return true;
    }
  });

  // Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      RFPID: true,
      "Event Date": true,
      "Deadline for proposal": true,
      Services: true,
      "Display Name": true,
      Status: true,
      Edit: canView || canUpdate || true,
      Delete: canDelete || true,
      Actions: true,
      "Convert to Quotes from Vendor": true,
    }
  );
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
      "RFPID": true,
      "Event Date": true,
      "Deadline for proposal": true,
      Services: true,
      "Display Name": true,
      Status: true,
      Edit: canView || canUpdate,
      Delete: canDelete,
       Actions: true,
      "Convert to Quotes from Vendor": true,
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

     
        <div className="bg-white table_container rounded-xl p-6 mt-10  ">
          <div className="search_boxes flex justify-between items-center  ">
            {/* Heading on the Left */}
            <h2 className="text-xl font-semibold text-gray-800">
              All RFPs List
            </h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full">
                <input
                  type="search"
                  className="rounded-md w-full border text-sm px-3 border-gray-300 py-1.5  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search by RFPID"
                  value={query}
                  onChange={handleSearchInput}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      refetch();
                    }
                  }}
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
                onClick={() => navigate("/add-rfps")}
                className="flex w-full items-center justify-center gap-1 px-3 py-1.5 text-sm text-white rounded-md bg-orange-400 border border-gray-300"
              >
                <FaPlus />
                <span>New RFPs</span>
              </button>
            </div>
          </div>
          {/* React Table */}
          <div className=" mt-5">
            <ReactTable
              data={RfpData.data}
              columns={filteredColumns}
              loading={false}
              totalRows={RfpData?.total}
              onChangePage={setPageIndex}
              onChangeRowsPerPage={setPageSize}
            // pagination
            // paginationPerPage={rowsPerPage}
            // paginationRowsPerPageOptions={[5, 10, 20]}
            />
          </div>
        </div>
     
    </>
  );
}

export default RfpList;
