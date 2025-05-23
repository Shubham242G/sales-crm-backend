import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { RiDeleteBin6Line, RiH6 } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaFileImport, FaColumns } from "react-icons/fa";
import {
  useVendorById,
  useVendor,
  usedeleteVendorById,
  useUpdateVendorById,
  useConvertVendorToSalesContact,
  useBulkUpload,
  useSyncZohoVendors
} from "@/services/vendor.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { SiConvertio } from "react-icons/si";
import { useSyncZohoInvoices } from "@/services/zoho_invoice.service";
import { Modal, Switch } from "@mui/material";
import { Box } from "lucide-react";
import { FiEdit } from "react-icons/fi";

function VendorList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

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

  const { data: VendorData, refetch } = useVendor(searchObj);

  const { mutateAsync: deleteVendor } = usedeleteVendorById();
  const { mutateAsync: updateVendor } = useUpdateVendorById();
  const { mutateAsync: convertVendorToSalesContact } =
    useConvertVendorToSalesContact();

    const syncVendorsMutation = useSyncZohoVendors();

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Vendors");

  const { mutateAsync: BulkUpload } = useBulkUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Import button click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

   const handleSyncVendors = async () => {
          try {
              const result = await syncVendorsMutation.mutateAsync();
              toastSuccess(`Successfully synced! Created: ${result.data.data.createdCount}, Updated: ${result.data.data.updatedCount}`);
              refetch(); // Refresh the data after sync
          } catch (error) {
              toastError("Failed to sync invoices");
          }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const allowedExtensions = ["xlsx", "csv"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExtensions.includes(fileExtension)) {
        toastError("Invalid file type. Please upload an Excel or CSV file.");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      const { data: response } = await BulkUpload(formData);
      if (response.data) {
        toastSuccess(`${response.data.successCount} cities imported successfully!
              ${response.data.errorCount} cities failed to import. Please check the file for errors.
              ${response.data.errorArr.map((item: any) => item.error)}
              `);
      }
    } catch (error) {
      toastError(error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const { data: res } = await deleteVendor(id);
        if (res) {
          toastSuccess(res.message);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const { data: res } = await updateVendor({
        id: id,
        obj: data,
      });
      if (res) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleConvertToSalesContact = async (id: string) => {
    try {
      const { data: res } = await convertVendorToSalesContact(id);
      if (res?.message) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError("Failed to convert vendor to Sales Contact.");
    }
  };

  const [isOpenAction, setIsOpenAction] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  
  const columns = [
    {
      name: "Vendor Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.vendor?.firstName}</h6>
        </div>
      ),
      width: "20px",
    },

    {
      name: "Display Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.vendor?.displayName}</h6>
        </div>
      ),
      width: "20px",
    },
    {
      name: "Company",
      selector: (row: any) => (
        <div className="flex gap-1 ">
          <h6>{row.vendor?.companyName}</h6>
          
        </div>
      ),
      width: "20px",
    },
    {
      name: "Location",
      selector: (row: any) => (
        <div className="flex gap-1 whitespace-pre-wrap">
          <h6>{row?.location?.state}</h6>
        </div>
      ),
      width: "20px",
    },
    {
      name: "Phone",
      selector: (row: any) => (
        <h6 className="flex gap-1"> <FaMobileScreenButton className="text-[#938d8d]" />
          {row.vendor?.phoneNumber}
          </h6>
         
      ),
      width: "20px"
    },
    {
      name: "Email",
      selector: (row: any) => ( <h6>{row.vendor?.email}</h6> ),
      width: "20px",
    },
    {
      name: "Actions",
      width: "50px",
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
            <div className="absolute bg-white z-10 shadow-lg rounded-md overflow-hidden border">

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
    
    // {
    //   name: "Convert to Sales Contact",
    //   width: "14%",
    //   selector: (row: any) => (
    //     <div className="flex justify-center">
    //       <button
    //         type="button"
    //         onClick={() => handleConvertToSalesContact(row._id)}
    //         className="text-lg text-blue-500 hover:text-blue-700"
    //         title="Convert to Sales Contact"
    //       >
    //         <SiConvertio />
    //       </button>
    //     </div>
    //   ),
    // },
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

  useEffect(() => {
    refetch();
  }, [searchObj, refetch]);

// Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState< Record<string, boolean>>({
    "Vendor Name": true,
    "Display Name": true,
    "Company": true,
    "Location": true,
    "Phone": true,
    "Email": true,
    // "Update": canView || canUpdate ,
    // "Delete": canDelete ,
    "Actions": true,
  }); 
  useEffect(() => {
    const savedColumns = localStorage.getItem('enquiryTableColumnsVendor');
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    if(canView !==undefined){
 localStorage.setItem('enquiryTableColumnsVendor', JSON.stringify(visibleColumns));
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
    "Vendor Name": true,
    "Display Name": true,
    "Company": true,
    "Location": true,
    "Phone": true,
    "Email": true,
    "Actions": true,
    // "Update": canView || canUpdate,
    // "Delete": canDelete 
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

      <div className="container px-6">
           <div className=" table_container rounded-xl px-3 py-1.5 ">
          <div className="flex flex-wrap items-center container justify-between gap-3 text-sm  mb-2  -mt-8 ">
            {/* Heading on the Left */}
            <h2 className="text-lg font-semibold -ml-8 text-gray-800">
              All Vendor List
            </h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2 ">
              {/* Search Box (updated to filter by location.state) */}
              <div className="w-full">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="rounded-md w-[250px] border px-3  border-gray-300 py-1.5 text-center placeholder-txtcolor focus:outline-none focus:border-orange-500"
                  placeholder="Search by Vendor Name "
                />
              </div>
              {/* Buttons */}
             {/* {/* <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button> */} 
              {/* Import Button */}
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300"
                onClick={handleImportClick}
              >
                <FaFileImport />
                Import
              </button>

            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
              >
                <FaColumns /> Columns
              </button>
              {showColumnSelector && <ColumnSelector />}
            </div>


              {/* Hidden File Input for Import */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />

              <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300" onClick={()=>handleSyncVendors()}>
                <FaFileExport /> Export
              </button>


              {canCreate && (
                <button
                  onClick={() => navigate("/add-vendor")}
                  className="flex w-full items-center justify-center gap-1 px-3 py-1.5 text-white rounded-md bg-orange-500 border border-gray-300"
                >
                  <FaPlus />
                  <span>New Vendor</span>
                </button>
              )}
            </div>
          </div>
          {/* React Table */}
           <div className="   shadow-xl -ml-14 -mr-9  text-sm   h-[580px] overflow-y-auto ">
          <ReactTable
            
            data={VendorData?.data}
            columns={filteredColumns}
            loading={false}
            totalRows={VendorData?.total}
            onChangeRowsPerPage={setPageSize}
            onChangePage={setPageIndex}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
          />
          </div>
        </div>
      </div>

    </>
  );
}

export default VendorList;
