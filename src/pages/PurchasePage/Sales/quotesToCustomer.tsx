import { ReactTable } from "../../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../../_components/Breadcrumb/Breadcrumb";
import {
  FaEdit,
  FaTrash,
  FaFilter,
  FaFileExport,
  FaPlus,
  FaEye,
  FaColumns,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { checkPermissionsForButtons } from "@/utils/permission";
import {
  useQuotesToCustomer,
  usedeleteQuotesToCustomerById,
} from "@/services/quotesToCustomer.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Switch } from "@mui/material";
import { FiEdit } from "react-icons/fi";

interface IQuotesToCustomer {
  _id: string;
  quotesId: string;
  customerName: string;
  displayName: string;
  leadId: string;
  serviceType: string[];
  amount: number;
  status: string;
  totalAmount: number;
}

function QuotesForCustomer() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [leadId, setLeadId] = useState("");

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Quotes for Customer");

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  useEffect(() => {
    // This will trigger a refetch whenever this component is rendered/re-rendered
    refetch();
  }, [location.pathname]);

  const {
    data: quotesToCustomerData,
    isLoading,
    refetch,
  } = useQuotesToCustomer(searchObj);
  const { mutateAsync: deleteQuote } = usedeleteQuotesToCustomerById();

  const handleDelete = async (id: string) => {
    try {
      const { data: res } = await deleteQuote(id);
      toastSuccess(res.message || "Quote deleted successfully");
      refetch(); // Refetch the data to update the table
    } catch (error) {
      toastError(error);
    }
  };

  const [isOpenAction, setIsOpenAction] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const columns = [
    {
      name: "Quotes Id",
      selector: (row: IQuotesToCustomer & { _id: string }) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.quotesId || "N/A"}</h6>
        </div>
      ),
      width: "160px",
    },
    {
      name: "Customer Name",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.customerName || "N/A"}</h6>
        </div>
      ),
      width: "160px",
    },
    {
      name: "Service",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex flex-wrap justify-around">
          {(row.serviceType || []).map((service: string, index: number) => (
            <div
              key={index}
              className="bg-sky-100 text-blue-800 text-xs px-2 py-1 ml-1 rounded-full border border-sky-300 shadow-sm"
            >
              {service}
            </div>
          ))}
        </div>
      ),
      width: "180px",
    },
    {
      name: "Amount",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.amount || 0}</h6>
        </div>
      ),
      width: "130px",
    },
    {
      name: "Display Name",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.displayName || 0}</h6>
        </div>
      ),
      width: "140px",
    },
    {
      name: "Status",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.status || "N/A"}</h6>
        </div>
      ),
      width: "180px",
    },
    {
      name: "Total Amount",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex gap-1  flex-col">
          <h6>{row.totalAmount || "N/A"}</h6>
        </div>
      ),
      width: "130px",
    },
    // {
    //   name: "Edit",
    //   width: "100px",
    //   selector: (row: IQuotesToCustomer & { _id: string }) => (
    //     <button
    //       onClick={() => navigate(`/addQuotesToCustomer/${row._id}`)}
    //       className="text-black-500 text-lg  hover:bg-black-100 rounded-full transition duration-200 "
    //     >

    //       <FaEye className=" hover:text-orange-500" />
    //     </button>
    //   ),
    // },
    // {
    //   name: "Delete",
    //   width: "100px",
    //   selector: (row: IQuotesToCustomer & { _id: string }) => (
    //     <button
    //       onClick={() => handleDelete(row._id)}
    //       className="text-black-500 text-lg  hover:bg-black-100 rounded-full transition duration-200"
    //     >
    //       <RiDeleteBin6Line className="hover:text-red-600" />

    //     </button>
    //   ),
    // },
    {
         name: "Actions",
         width: "120px",
         selector: (row:  IQuotesToCustomer) => (
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
                   to={`/addQuotesToCustomer/${row?._id}`}
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
    if (item.name === "Delete") {
      return canDelete;
    } else if (item.name === "Edit") {
      return canView || (canView && canUpdate);
    } else {
      return true;
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPageIndex(1);
  };


  // Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    "Quotes Id": true,
      "Customer Name": true,
      "Service": true,
      "Amount": true,
      "Display Name": true,
      "Status": true,
      "Total Amount": true,
      "Edit": canView || canUpdate ,
      "Delete": canDelete ,
      Actions : true || canView || canUpdate || canDelete
  });
  useEffect(() => {
    const savedColumns = localStorage.getItem('enquiryTableColumnsQuotesToCustomer');
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    if(canView !== undefined){
       localStorage.setItem('enquiryTableColumnsQuotesToCustomer', JSON.stringify(visibleColumns));
      
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
      "Customer Name": true,
      "Service": true,
      "Amount": true,
      "Display Name": true,
      "Status": true,
      "Total Amount": true,
      "Edit": canView || canUpdate,
      "Delete": canDelete ,
       Actions : true || canView || canUpdate || canDelete
    });
  };




  return (
    
      <div className="table_container rounded-xl mt-10 p-6">
        <div className="search_boxes flex justify-between items-center ">
          <h2 className="text-xl font-semibold text-gray-800">
            All Quotes for Customer List
          </h2>

          <div className="flex items-center justify-start gap-2">
            <div className="w-full">
              <input
                type="search"
                className="rounded-md w-full border px-3 text-sm border-gray-300 py-1.5 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
                value={query}
                onChange={handleSearchChange}
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
              {/* <button className="flex items-center gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
              <FaFilter /> Filter
            </button> */}
            <button className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
              <FaFileExport /> Export
            </button>

            {canCreate && (
              <button
                onClick={() => navigate("/addQuotesToCustomer")}
                className="flex w-full items-center text-sm justify-center gap-1 px-3 py-1.5 text-white rounded-md bg-orange-500 border border-gray-300"
              >
                <FaPlus />
                <span>New Quotes</span>
              </button>
            )}
          </div>
        </div>
      <div className="mt-5">
        <ReactTable
          data={quotesToCustomerData?.data || []}
          columns={filteredColumns} 
 selectableRows={true}
          loading={isLoading}
          totalRows={quotesToCustomerData?.total || 0}
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

export default QuotesForCustomer;
