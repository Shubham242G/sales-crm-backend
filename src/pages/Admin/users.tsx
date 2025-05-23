import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaColumns } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { useUser, useDeleteUser, useUpdateUser } from "@/services/user.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { ClassNames } from "@emotion/react";
import { filter } from "lodash";
import { Switch } from "@mui/material";

function Users() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("User");

  const { mutateAsync: updateUser } = useUpdateUser();

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize: pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  console.log(pageIndex, pageSize, query, "check pageIndex, pageSize , query");

  const { data: UserData } = useUser(searchObj);
  const { mutateAsync: deleteUser } = useDeleteUser();

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this user?")) {
        const { data: res } = await deleteUser(id);
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
      const { data: res } = await updateUser({ id, ...data });
      if (res) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row: any) => (<h6>{row?.name || "N/A"}</h6>),
      width: "239px",
    },
    {
      name: "Email",
      selector: (row: any) => (<h6>{row?.email || "N/A"}</h6>),
      width: "320px",
    },
    {
      name: "Role",
      selector: (row: any) => (<h6>{row?.role || "N/A"}</h6>),
      width: "210px",

    },
    {
      name: "Edit",
      width: "200px",
      selector: (row: any) =>
        (canView || canUpdate) && (
          <div className=""><Link
            to={`/add-users/${row._id}`}
            onClick={() => handleUpdate(row._id, row.data)}
            className="  text-black-500 text-lg  hover:text-orange-500"
          >
            <FaEye />
          </Link></div>
        ),
    },
    {
      name: "Delete",
      width: "200px",
      selector: (row: any) =>
        canDelete && (
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
    "Email": true,
    "Role": true,
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
    "Name": true,
    "Email": true,
    "Role": true,
    "Edit": canView || canUpdate || true,
    "Delete": canDelete || true,
    });
  };




  return (
    <>
     <div className="container ">
        <div className=" table_container rounded-xl px-4 pt-4  ">
         
          <div className="flex flex-wrap items-center container justify-between gap-3 text-sm -ml-5 mb-2 -mt-8">
            <h2 className="text-lg ml-1 font-semibold text-[#2a2929]">Users List</h2>

            <div className="flex items-center justify-start gap-2">
              <div className="w-full flex items-center">
                <input
                  type="search"
                  className="rounded-md border px-3 py-1.5 w-[200px] border-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Search by Username"
                  onChange={(e) => setQuery(e.target.value)}
                />
                {/* <div className="relative right-8">
                  <IoSearchOutline />
                </div> */}
              </div>


              <div className="relative">
                <button
                  className="flex items-center gap-1 px-4 py-1.5 text-sm rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                >
                  <FaColumns /> Columns
                </button>
                {showColumnSelector && <ColumnSelector />}
              </div>

              <button
                onClick={() => navigate("/add-users")}
                className="flex w-full items-center py-1.5 justify-center gap-1 px-3  text-white rounded-md bg-orange-500 border border-gray-300"
              >
                <FaPlus />
                <span>New User</span>
              </button>
            </div>
          </div>


         <div className=" table_container shadow-lg   -ml-9  text-sm   h-[590px] -mr-4 overflow-y-auto ">
          <ReactTable
            data={UserData?.data}
            columns={filteredColumns}
            loading={false}
            totalRows={UserData?.total}
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

export default Users;



