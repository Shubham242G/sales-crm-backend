import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaFileImport, FaColumns } from "react-icons/fa";
import {
  useZohoCustomers,
  useZohoCustomerById,
  useSyncZohoCustomers,
  updateCustomerById,
  deleteCustomerById
} from "@/services/customer.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { useUpdateQuotesToCustomerById } from "@/services/quotesToCustomer.service";
import { Switch } from "@mui/material";


function CustomerSales() {
  const navigate = useNavigate();
  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Customers");

  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [leadId, setLeadId] = useState("");



  const searchObj = useMemo(() => ({
    ...(query && { query }),
    pageIndex: pageIndex - 1,
    pageSize,
  }), [pageIndex, pageSize, query]);

  console.log(searchObj, "searchObj")

  const { data: CustomerData } = useZohoCustomers(searchObj);
  const { mutateAsync: syncData } = useSyncZohoCustomers();

  const handleSyncCustomer = async () => {
    try {
      const result = await syncData()
      toastSuccess(`Successfully synced! Created: ${result.data.data.createdCount}, Updated: ${result.data.data.updatedCount}`);
      // Refresh the data after sync
    } catch (error) {
      toastError("Failed to sync invoices");
    }
  };



  const { id } = useParams<{ id: string }>();

  const { mutateAsync: updateCustomer } = updateCustomerById();
  const { mutateAsync: deleteCustomer } = deleteCustomerById()

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const { data: res } = await deleteCustomer(id);
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
      const { data: res } = await updateCustomer({ id, ...data });
      if (res) toastSuccess(res.message);
    } catch (error) {
      toastError(error);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportClick = () => fileInputRef.current?.click();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPageIndex(1); // reset to first page when searching
    }
  };

  const columns = [
    {
      name: "Customer Type",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6 >{row.customerType}</h6>
        </div>
      ),
      width: "200px",
    },
    {
      name: "Customer Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6 >{row.companyName}</h6>
        </div>
      ),
      width: "180px",
    },
    {
      name: "Display Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6 >{row.displayName}</h6>
        </div>
      ),
      width: "180px",
    },
    {
      name: "Branch location",
      selector: (row: any) => (
        <div className="flex gap-1">
          {row.branchName}
        </div>
      ),
      width: "180px",
    },
    {
      name: "Email",
      selector: (row: any) => (<h6>{row.email}</h6>),
      width: "220px",
    },
    // {
    //   name: "Service",
    //   selector: (row: any) => (
    //     <>
    //       <div className="flex justify-around">
    //         {row.service.map((e: any, index: number) => (
    //           <div
    //             key={index}
    //             className="border border-b-purple-300 py-1 px-3 bg-gray-200 rounded-md"
    //           >
    //             {e.name}
    //           </div>
    //         ))}
    //       </div>
    //     </>
    //   ),
    //   width: "20%",
    // },
    // {
    //   name: "Lead Source",
    //   selector: (row: any) => (
    //     <div className="flex gap-1">
    //       <FaMobileScreenButton className=" text-[#938d8d]" />
    //       {row.company}
    //     </div>
    //   ),
    //   width: "20%",
    // },
    {
      name: "Edit",
      width: "100px",
      selector: (row: any) =>
        (canView || canUpdate) && (
          <div className="flex items-center gap-3">
            <Link
              to={`/add-customer/${row?._id}`}
              className=" text-black-400 text-lg flex items-center  hover:text-orange-500"
              onClick={() => handleUpdate(row._id, row.data)}
            >
              <FaEye />
            </Link>
          </div>
        ),
    },
    {
      name: "Delete",
      width: "100px",
      selector: (row: any) =>
        canDelete && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleDelete(row._id)}
              className=" text-black-400 text-lg "
              title="Delete Customer"
            >
              <RiDeleteBin6Line className="hover:text-red-600" />

            </button>
          </div>
        ),
    },
  ];

  const filterColumns = columns.filter((item) => {
    if (item.name === "Delete") return canDelete;
    if (item.name === "Edit") return canView || canUpdate;
    return true;
  });

  // Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    "Customer Type": true,
    "Customer Name": true,
    "Display Name": true,
    "Branch location": true,
    "Email": true,
    "Phone": true,
    "Edit": canView || canUpdate || true,
    "Delete": canDelete || true,
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
      "Customer Type": true,
      "Customer Name": true,
      "Display Name": true,
      "Branch location": true,
      "Email": true,
      "Phone": true,
      "Edit": canView || canUpdate || true,
      "Delete": canDelete || true,
    });
  };




  return (
    <div className="container px-6">
      <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
        <div className="search_boxes flex justify-between items-center ">
          <h2 className="text-xl font-semibold text-gray-800">Customer List</h2>
          <div className="flex items-center gap-2">
            <input
              type="search"
              className="rounded-md border px-4 py-2 placeholder-txtcolor focus:outline-none focus:border-buttnhover"
              placeholder="Search..."
              value={query}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
            />

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
              <FaFileExport /> Export
            </button>
            <button onClick={handleSyncCustomer} className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFileExport /> Sync
            </button>
            <button
              className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300"
              onClick={handleImportClick}
            >
              <FaFileImport /> Import
            </button>
            {canCreate && (
              <button
                onClick={() => navigate("/add-customer")}
                className="flex items-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500"
              >
                <FaPlus /> <span>New Customer</span>
              </button>
            )}
          </div>
        </div>
        <ReactTable
          data={CustomerData?.data}
          columns={filteredColumns}
          loading={false}
          totalRows={CustomerData?.total}
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

export default CustomerSales;


