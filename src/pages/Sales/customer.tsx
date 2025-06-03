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
  deleteCustomerById,
  useAddCustomer,
  getCustomersExcel,
  addCustomersExcel
} from "@/services/customer.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { useUpdateQuotesToCustomerById } from "@/services/quotesToCustomer.service";
import { Switch } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import NewTable from "@/_components/ReuseableComponents/DataTable/newTable";


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
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

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
    // {
    //   name: "Edit",
    //   width: "100px",
    //   selector: (row: any) =>
    //     (canView || canUpdate) && (
    //       <div className="flex items-center gap-3">
    //         <Link
    //           to={`/add-customer/${row?._id}`}
    //           className=" text-black-400 text-lg flex items-center  hover:text-orange-500"
    //           onClick={() => handleUpdate(row._id, row.data)}
    //         >
    //           <FaEye />
    //         </Link>
    //       </div>
    //     ),
    // },
    // {
    //   name: "Delete",
    //   width: "100px",
    //   selector: (row: any) =>
    //     canDelete && (
    //       <div className="flex items-center gap-3">
    //         <button
    //           type="button"
    //           onClick={() => handleDelete(row._id)}
    //           className=" text-black-400 text-lg "
    //           title="Delete Customer"
    //         >
    //           <RiDeleteBin6Line className="hover:text-red-600" />

    //         </button>
    //       </div>
    //     ),
    // },
    {
      name: "Actions",
      width: "20px",
      selector: (row: any) => (
        <div className="">
          <button
            type="button"

            title="More Actions"
            onClick={(e) => { setIsOpenAction(selectedRowId === row._id ? !isOpenAction : true), setSelectedRowId(row._id) }}
          >
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,1)"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path></svg></span>
          </button>
          {selectedRowId === row._id && (isOpenAction) && (
            <div className="absolute lead-dropdown bg-white z-10 shadow-lg rounded-md overflow-hidden -ml-10 border">

              <Link
                to={`/add-customer/${row?._id}`}
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
    Actions: true || canView || canUpdate || canDelete
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

    const columnsWithDynamicWidth = columnsArray.map(column => ({
      ...column,
      width: column.name === "Email" ? "300px" : `${1200 / visibleColumnsCount}px`
    }));

    console.log(columnsWithDynamicWidth, "check the column width")

    return columnsWithDynamicWidth;
  };
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
      Actions: true || canView || canUpdate || canDelete
    });
  };

  const [tickRows, setTickRows] = useState([]);

  const handleChange = ({ selectedRows }: any) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", selectedRows);
    setTickRows(selectedRows.map((row: any) => row._id));
  };




  return (

    //       <div className="bg-white table_container rounded-xl  p-6 mt-10">
    //         <div className="search_boxes flex justify-between items-center  ">
    //           <h2 className="text-xl font-semibold text-gray-800">Customer List</h2>
    //           <div className="flex items-center gap-2  w-[70%] ">
    //             <input
    //               type="search"
    //               className="rounded-md border text-sm px-3 py-1.5 placeholder-txtcolor focus:outline-none focus:border-buttnhover w-full md:w-1/4"
    //               placeholder="Search..."
    //               value={query}
    //               onChange={handleSearchInputChange}
    //               onKeyDown={handleSearchKeyDown}
    //             />

    //             <div className="relative w-full md:w-1/4">
    //               <button
    //                 className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap w-full"
    //                 onClick={() => setShowColumnSelector(!showColumnSelector)}
    //               >
    //                 <FaColumns /> Columns
    //               </button>
    //               {showColumnSelector && <ColumnSelector />}
    //             </div>


    //               <button className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 w-full md:w-1/4">
    //               <FaFileExport /> Export
    //             </button>
    //             <button onClick={handleSyncCustomer} className="flex items-center gap-1 text-sm  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 w-full md:w-1/4">
    //               <FaFileExport /> Sync
    //             </button>
    //             <button
    //               className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 w-full md:w-1/4"
    //               onClick={handleImportClick}
    //             >
    //               <FaFileImport /> Import
    //             </button>
    //             {canCreate && (
    //               <button
    //                 onClick={() => navigate("/add-customer")}
    //                 className="flex items-center gap-1 px-3 py-2 text-xs text-white rounded-md bg-orange-500 w-full md:w-1/4"
    //               >
    //                 <FaPlus /> <span>New Customer</span>
    //               </button>
    //             )}
    //           </div>
    //         </div>
    //         <div className="mt-5">
    //         <ReactTable
    //           data={CustomerData?.data}
    //           columns={filteredColumns} 
    //  selectableRows={true}
    //           loading={false}
    //           totalRows={CustomerData?.total}
    //           onChangeRowsPerPage={setPageSize}
    //           onChangePage={setPageIndex}
    //           page={pageIndex}
    //           rowsPerPageText={pageSize}
    //           isServerPropsDisabled={false}

    //         />
    //        </div>

    //       </div>

    <NewTable
      data={CustomerData?.data}
      columns={columns}
      selectableRows={true}
      loading={false}
      totalRows={CustomerData?.total}
      onChangeRowsPerPage={setPageSize}
      onChangePage={setPageIndex}
      page={pageIndex}
      rowsPerPageText={pageSize}
      isServerPropsDisabled={false}

      onSelectedRowsChange={handleChange}
      className={"leadtable"}
      //new fiel
      TableName={"Customer List"}
      TableGetAllFunction={useZohoCustomers}
      syncFunctiono={useSyncZohoCustomers}
      ExcelExportFunction={getCustomersExcel}
      TableAddExcelFunction={addCustomersExcel}
      RouteName={"Customers"}
      AddButtonRouteName={"/add-customer"}
      AddButtonName={"New Customer"}
      placeholderSearch={"Search display name"}
    />


  );
}

export default CustomerSales;


