import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaColumns } from "react-icons/fa";
import {
  ICategory,
  useCategory,
  usedeleteCategoryById,
} from "@/services/category.service";
import { format } from "date-fns";
import { toastError, toastSuccess } from "@/utils/toast";
import { addHotelExcel, getHotelExcel, usedeleteHotelById, useHotel } from "@/services/hotel.service";
import { pageIndex, pageSize } from "@/common/constant.common";
import { checkPermissionsForButtons } from "@/utils/permission";
import { filter } from "lodash";
import { Switch } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import NewTable from "@/_components/ReuseableComponents/DataTable/newTable";

function HotelList() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const { canCreate, canUpdate, canDelete, canView } =
    checkPermissionsForButtons("Add Hotel");

  const searchObj = useMemo(() => {
    let obj: any = {};

    if (query && query != "") {
      obj.query = query;
    }
    obj.pageIndex = pageIndex - 1;
    obj.pageSize = pageSize;
    return obj;
  }, [pageIndex, pageSize, query]);
  const handlePerRowsChange = (newPerPage: any) => {
    setPageSize(newPerPage);
  };

  const handlePageChange = (newPage: any) => {
    setPageIndex(newPage);
  };
  const { data: hotelData, refetch } = useHotel(searchObj);
  const { mutateAsync: deleteHotel } = usedeleteHotelById();
   const [isOpenAction, setIsOpenAction] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleDelete = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this Hotel?")) {
        const { data: res } = await deleteHotel(id);

        if (res) {
          toastSuccess(res.message);
          navigate("/hotel");
        }
      }
    } catch (error) {
      toastError(error);
    }

    

    // if (confirm("Are you sure you want to delete this Hotel?")) {
    //     deleteHotel(id, {
    //         onSuccess: () => {
    //             toastSuccess("Hotel deleted successfully!");
    //             // refetch(); // Refresh the data
    //         },
    //         onError: (error: any) => {
    //             console.error("Error deleting Hotel:", error.message);
    //             toastError("Failed to delete Hotel.");
    //         },
    //     });
    // }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };
  const columns = [
    {
      name: "Hotel Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.name}</h6>
        </div>
      ),
      width: "40%",
    },

    {
      name: "Date",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>
            {row.createdAt
              ? format(new Date(row.createdAt), "dd MMMM, yyyy")
              : "-"}
          </h6>
        </div>
      ),
      width: "20%",
    },
    // {
    //   name: "Edit",
    //   width: "20%",
    //   selector: (row: ICategory) => (
    //     <div className="flex items-center gap-3">
    //       <Link
    //         to={`/hotel/${row?._id}`}
    //         className="text-black-400 text-lg flex items-center"
    //       >
            
    //           <FaEye className=" hover:text-orange-500" />
    //       </Link>
    //     </div>
    //   ),
    // },
    // {
    //   name: "Delete",
    //   width: "20%",
    //   selector: (row: ICategory) => (
    //     <div className="flex items-center gap-3">
    //       <button
    //         onClick={() => handleDelete(row._id)}
    //         className=" text-black-400 text-lg flex items-center"
    //       >
    //           <RiDeleteBin6Line className="hover:text-red-600"/>
             
    //       </button>
    //     </div>
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
{/*    
                 <Link
                   to={`/add-hotel/${row?._id}`}
                   className="flex items-center text-gray-600 hover:bg-blue-500 hover:text-white px-4 border-b py-2 gap-2"
                   title="View Vendor"
                 >
                   <FiEdit className="text-xs" />
                   Edit
                 </Link> */}
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
    const [visibleColumns, setVisibleColumns] = useState({
     "Hotel Name":true,
      "Date": true,
      "Edit": true,
      "Delete": true,
      Actions : true
      
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
      "Hotel Name":true,
      "Date": true,
      "Edit": true,
      "Delete": true,
      Actions : true
      });
    };


const [tickRows, setTickRows] = useState([]);

 const handleChange = ({ selectedRows }: any) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", selectedRows);
    setTickRows(selectedRows.map((row: any) => row._id));
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

{/* 
        <div className="bg-white table_container rounded-xl mt-10 p-6">
          <div className="search_boxes flex justify-between items-center">
            {/* Heading on the Left */}
            {/* <h2 className="text-xl font-semibold text-gray-800">
              All Hotel List
            </h2> */}

            {/* Search and Buttons on the Right */}
            {/* <div className="flex items-center justify-start gap-2 "> */}
              {/* Search Box */}
              {/* <div className="w-full">
                <input
                  type="search"
                  className="rounded-md w-full border px-4 border-gray-300 py-2  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
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
                              className="flex items-center gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                              onClick={() => setShowColumnSelector(!showColumnSelector)}
                            >
                              <FaColumns /> Columns
                            </button>
                            {showColumnSelector && <ColumnSelector />}
                          </div>
 */}

              {/* Buttons */}
              {/* <button className="flex items-center gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button> */}
              {/* <button className="flex items-center gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
                <FaFileExport /> Export
              </button>
              {canCreate && (
                <button
                  onClick={() => navigate("/hotel")}
                  className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
                >
                  <FaPlus />
                  <span>New Hotel</span>
                </button>
              )}
            </div>
          </div> */}
          {/* React Table */}
         {/* <div className="mt-5"> 
          <ReactTable
            data={hotelData?.data}
            columns={filteredColumns} 
 selectableRows={true}
            loading={false}
            totalRows={hotelData?.total}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
          /></div>
        </div> */} 

         <NewTable
          data={hotelData?.data}
            columns={columns} 
 selectableRows={true}
            loading={false}
            totalRows={hotelData?.total}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
        
        onSelectedRowsChange={handleChange}
        className={"leadtable"}
        //new fields
        TableName={"Leads List"}
        TableGetAllFunction={useHotel}
        ExcelExportFunction={getHotelExcel}
        TableAddExcelFunction={addHotelExcel}
        RouteName={"Add Hotel"}
        AddButtonRouteName={"/hotel"}
        AddButtonName={"New hotel"}
        placeholderSearch={"Search Hotel Name"}
      /> 
      
    </>
  );
}

export default HotelList;
