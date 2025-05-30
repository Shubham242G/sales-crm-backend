import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { RiDeleteBin6Line, RiH6 } from "react-icons/ri";
import { FaColumns, FaPlus } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { addRolesExcel, getRolesExcel, usedeleteRolesById, useRoles } from "@/services/roles.service";
import { toastError, toastSuccess } from "@/utils/toast";
import RoleHierarchy from "@/pages/Hierarchy/roleHierarchy";
import { Switch } from "@mui/material";
import { checkPermissionsForButtons } from "@/utils/permission";
import { FiEdit } from "react-icons/fi";
import NewTable from "@/_components/ReuseableComponents/DataTable/newTable";



function Roles() {
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

  const { data: roleData } = useRoles(searchObj);
  const { mutateAsync: deleteRoles } = usedeleteRolesById();
   const { canCreate, canDelete, canUpdate, canView } =
      checkPermissionsForButtons("Roles");

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this role?")) {
        const { data: res } = await deleteRoles(id);
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
      name: "Name",
      selector: (row: any) => (<h6>{row.name}</h6>),
      width: "260px",
    },
    {
      name: "Role",
      selector: (row: any) => (<h6>{row.roleName}</h6>),
      width: "260px",
    },

    {
      name: "Hierarchy",
      selector: (row: any) => (row.hierarchy ? <h6>{row.hierarchy}</h6> : <h6>{"N/A"}</h6>),
      width: "240px",
    },

 
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
   
                 <Link
                   to={`/add-role/${row?._id}`}
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


  // Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    "Name": true,
    "Role": true,
    "Hierarchy": true,
    "Edit": canView || canUpdate,
    "Delete": canDelete,
    Actions : true
  });
  useEffect(() => {
    const savedColumns = localStorage.getItem('enquiryTableColumnsRoles');
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    if(canView !== undefined){
 localStorage.setItem('enquiryTableColumnsRoles', JSON.stringify(visibleColumns));
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
      "Name": true,
      "Role": true,
      "Hierarchy": true,
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
   
         {/* <div className=" table_container rounded-xl p-6 mt-10   ">
          <div className="flex flex-wrap items-center container justify-between gap-3 text-sm ">
          <h2 className="text-lg font-semibold text-gray-800">Roles List</h2>
          <div className="flex items-center justify-start gap-2">
            <div className="w-full flex items-center">
              <input
                type="search"
                className="rounded-md w-[250px] border px-3 border-gray-300 py-1.5 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search by role name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>


            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
              >
                <FaColumns /> Columns
              </button>
              {showColumnSelector && <ColumnSelector />}
            </div>


            <button
              onClick={() => navigate("/add-role")}
              className="flex w-full items-center py-1.5 justify-center gap-1 px-3  text-white rounded-md bg-orange-500 border border-gray-300"
            >
              <FaPlus />
              <span>New Role</span>
            </button>
          </div>
        </div>

         <div className=" mt-5 ">
         <ReactTable
          data={roleData?.data}
          columns={filteredColumns} 
 selectableRows={true}
          loading={false}
          totalRows={roleData?.total}
          onChangePage={setPageIndex}
          onChangeRowsPerPage={setPageSize}
          page={pageIndex}
          rowsPerPageText={pageSize}
          isServerPropsDisabled={false}
        />
      
        </div>
          
      </div> */}
      
  


       <NewTable
       data={roleData?.data}
          columns={filteredColumns} 
          selectableRows={true}
          loading={false}
          totalRows={roleData?.total}
          onChangePage={setPageIndex}
          onChangeRowsPerPage={setPageSize}
          page={pageIndex}
          rowsPerPageText={pageSize}
          isServerPropsDisabled={false}
        
        onSelectedRowsChange={handleChange}
        className={"leadtable"}
        //new fields
        TableName={"Roles List"}
        TableGetAllFunction={useRoles}
        ExcelExportFunction={getRolesExcel}
        TableAddExcelFunction={addRolesExcel}
        RouteName={"Leads"}
        AddButtonRouteName={"/add-role"}
        AddButtonName={"New Role"}
        placeholderSearch={"Search by Name"}
      /> 
    </>
  );
}

export default Roles;