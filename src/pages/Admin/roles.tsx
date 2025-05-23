import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { RiDeleteBin6Line, RiH6 } from "react-icons/ri";
import { FaColumns, FaPlus } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { usedeleteRolesById, useRoles } from "@/services/roles.service";
import { toastError, toastSuccess } from "@/utils/toast";
import RoleHierarchy from "@/pages/Hierarchy/roleHierarchy";
import { Switch } from "@mui/material";
import { checkPermissionsForButtons } from "@/utils/permission";



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
      name: "Edit",
      width: "200px",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => navigate(`/add-role/${row._id}`)}
          className="text-black-500 text-lg "
        >
          <FaEye className=" hover:text-orange-500" />
        </button>
      ),
    },
    {
      name: "Delete",
      width: "200px",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => handleDelete(row._id)}
          className=" text-black-400 text-lg"
        >
          <RiDeleteBin6Line className="hover:text-red-600" />

        </button>
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
      "Name": true,
      "Role": true,
      "Hierarchy": true,
      "Edit": true,
      "Delete": true,
    });
  };

  return (
    <>
    <div className="container  -mt-12">
         <div className=" table_container rounded-xl   px-3 py-1.5   ">
          <div className="flex flex-wrap items-center container justify-between gap-3 text-sm -ml-4 mt-5 mb-4">
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

         <div className=" table_container  shadow-xl -ml-8   text-sm  -mr-2 overflow-y-auto  ">
         <ReactTable
          data={roleData?.data}
          columns={filteredColumns}
          loading={false}
          totalRows={roleData?.total}
          onChangePage={setPageIndex}
          onChangeRowsPerPage={setPageSize}
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

export default Roles;