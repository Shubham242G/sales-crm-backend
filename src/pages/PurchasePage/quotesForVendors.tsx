import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaColumns } from "react-icons/fa";
import { SiConvertio } from "react-icons/si";
import {
  addQuotesFromVendorsExcel,
  getQuotesFromVendorsExcel,
  useConvertQuotesFromVendorToQuotesToCustomer,
  useQuotesFromVendors,
  useQuotesFromVendorsById,
  usedeleteQuotesFromVendorsById,
} from "@/services/quotesFromVendors.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { Switch } from "@mui/material";
import { checkPermissionsForButtons } from "@/utils/permission";
import { FiEdit } from "react-icons/fi";
import NewTable from "@/_components/ReuseableComponents/DataTable/newTable";
import moment from "moment";

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
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
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
      width: "110px",
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
      name: "Services",
      selector: (row: any) => (
        <div className="flex flex-wrap justify-around">
          {row?.serviceType?.map((e: any, index: number) => (
            <div
              key={index}
              className="bg-sky-100 text-blue-800 text-xs px-2 py-1 ml-1 rounded-full border border-sky-300 shadow-sm"
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
      selector: (row: any) => <h6>{moment(row?.receivedDate).format("YYYY, MMMM, DD")}</h6>,
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
    // {
    //   name: "Action",
    //   width: "150px",
    //   selector: (row: any) => (
    //     <div className="flex items-center gap-2">
    //       <Link
    //         to={`/addQuotesFromVendors/${row._id}`}
    //         className=" p-[3px] text-black-400 text-lg  hover:text-orange-500"
    //       >
    //         <FaEye />
    //       </Link>
    //       <button
    //         className=" text-black-400 text-lg "
    //         onClick={() => handleDelete(row._id)}
    //       >
    //         <RiDeleteBin6Line className="hover:text-red-500" />
    //       </button>
    //     </div>
    //   ),
    // },
    {
         name: "Actions",
         width: "120px",
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
                   to={`/addQuotesFromVendors/${row?._id}`}
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





    {
      name: "Convert to Customer Quote",
      width: "150px", selector: (row: any) => (
        <div>
          <button
            type="button"
            onClick={() => handleConvertToCustomerQuote(row._id)}
            className="text-sm text-black-400 hover:text-black-700 "
            title="Convert to Customer Quote"
          >
            <SiConvertio />
          </button>
        </div>
      ),
    },
  ];


  const { canView, canUpdate, canDelete } = checkPermissionsForButtons('Quotes from Vendors');

  // Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    "Quotes Id": true,
    "Vendor Name": true,
    "Display Name": true,
    "RPFs Id": true,
    "Status": true,
    "Services": true,
    "Amount": true,
    "Date Received": true,
    "Actions": canView || canUpdate || canDelete,
    "Convert to Customer Quote": true
  });
  useEffect(() => {
    const savedColumns = localStorage.getItem('enquiryTableColumnsQuotesFromVendors');
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    if (canView !== undefined) {
      localStorage.setItem('enquiryTableColumnsQuotesFromVendors', JSON.stringify(visibleColumns));
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

    const columnsWithDynamicWidth = columnsArray.map(column => ({
      ...column,
      width: column.name === "Service" ? "300px" : `${1200 / visibleColumnsCount}px`
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
      "Quotes Id": true,
      "Vendor Name": true,
      "Display Name": true,
      "RPFs Id": true,
      "Status": true,
      "Services": true,
      "Amount": true,
      "Date Received": true,
      "Actions": true,
      "Convert to Customer Quote": true
    });
  };

  const [tickRows, setTickRows] = useState([]);

 const handleChange = ({ selectedRows }: any) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", selectedRows);
    setTickRows(selectedRows.map((row: any) => row._id));
  };

  return (

    // <div className="h-[90vh]  mt-16 p-6 overflow-y-auto ">
    //   <div className="search_boxes flex justify-between items-center">
    //     <h2 className="text-xl font-semibold text-gray-800">
    //       Quotes from Vendor
    //     </h2>
    //     <div className="flex items-center justify-start gap-2">
    //       <div className="w-full">
    //         <input
    //           type="search"
    //           className="rounded-md w-[250px] text-sm border px-3 border-gray-300 py-1.5 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
    //           placeholder="Search by Vendor name"
    //           value={query}
    //           onChange={handleSearchInput}
    //           onKeyPress={(e) => {
    //             if (e.key === 'Enter') {
    //               refetch();
    //             }
    //           }}
    //         />
    //       </div>
    //       <div className="relative">
    //         <button
    //           className="flex items-center gap-1 text-sm  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
    //           onClick={() => setShowColumnSelector(!showColumnSelector)}
    //         >
    //           <FaColumns /> Columns
    //         </button>
    //         {showColumnSelector && <ColumnSelector />}
    //       </div>
    //       {/* <button className="flex items-center gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
    //           <FaFilter /> Filter
    //         </button> */}
    //       <button className="flex items-center gap-1 text-sm  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
    //         <FaFileExport /> Export
    //       </button>
    //       <button
    //         onClick={() => navigate("/addQuotesFromVendors")}
    //         className="flex w-full items-center justify-center gap-1 px-3 py-1.5 text-sm text-white rounded-md bg-orange-500 border border-gray-300"
    //       >
    //         <FaPlus />
    //         <span>New quotes for vendors</span>
    //       </button>
    //     </div>
    //   </div>
    //   <div className="mt-5">
    //     <ReactTable
    //       data={quotesFromVendors.data}
    //       columns={filteredColumns}
    //       selectableRows={true}
    //       loading={false}
    //       totalRows={quotesFromVendors.total}
    //       onChangeRowsPerPage={setPageSize}
    //       onChangePage={setPageIndex}
    //       page={pageIndex}
    //       rowsPerPageText={pageSize}
    //       isServerPropsDisabled={false}
    //     />
    //   </div>

      <NewTable
        data={quotesFromVendors.data}
        columns={columns}
        selectableRows={true}
        loading={false}
        totalRows={quotesFromVendors.total}
        onChangeRowsPerPage={setPageSize}
        onChangePage={setPageIndex}
        page={pageIndex}
        rowsPerPageText={pageSize}
        isServerPropsDisabled={false}
        onSelectedRowsChange={handleChange}
        className={"leadtable"}
        //new fields
        TableName={"Quotes from Vendor"}
        TableGetAllFunction={useQuotesFromVendors}
        ExcelExportFunction={getQuotesFromVendorsExcel}
        TableAddExcelFunction={addQuotesFromVendorsExcel}
        RouteName={"Quotes from Vendors"}
        AddButtonRouteName={"/addQuotesFromVendors"}
        AddButtonName={"New quotes for vendors"}
        placeholderSearch={"Search by Vendor name"}
      />


   
  );
}

export default CustomerLedger;