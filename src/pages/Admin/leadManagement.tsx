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
import { Switch } from "@mui/material";
import { addleadManagementExcel, getleadManagementExcel, useLeadManagement, useUpdateLeadManagementById } from "@/services/leadManagement.service";
import { FiEdit } from "react-icons/fi";
import NewTable from "@/_components/ReuseableComponents/DataTable/newTable";

function LeadManagement() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("User");

  const { mutateAsync: updateLeadManagement } = useUpdateLeadManagementById();

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize: pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  console.log(pageIndex, pageSize, query, "check pageIndex, pageSize , query");

  const { data: LeadManagementData } = useLeadManagement(searchObj);
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
      const { data: res } = await updateLeadManagement({ id, ...data });
      if (res) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const [isOpenAction, setIsOpenAction] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);



  const columns = [
    {
      name: "User Id",
      selector: (row: any) => (<h6>{row?.userId || "N/A"}</h6>),
      width: "239px",
    },
    {
      name: "lead Assigned",
      selector: (row: any) => (<h6>{row?.leadIds?.length || "N/A"}</h6>),
      width: "320px",
    },

    // {
    //   name: "Edit",
    //   width: "200px",
    //   selector: (row: any) =>
    //     (canView || canUpdate) && (
    //       <div className=""><Link
    //         to={`/add-leadManagement/${row._id}`}

    //         onClick={() => handleUpdate(row._id, row.data)}
    //         className="  text-black-500 text-lg  hover:text-orange-500"
    //       >
    //         <FaEye />
    //       </Link></div>
    //     ),
    // },
    // {
    //   name: "Delete",
    //   width: "200px",
    //   selector: (row: any) =>
    //     canDelete && (
    //       <button
    //         type="button"
    //         onClick={() => handleDelete(row._id)}
    //         className=" text-black-400 text-lg"
    //       >
    //         <RiDeleteBin6Line className="hover:text-red-600" />
    //       </button>
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
            <div className="absolute bg-white z-10 shadow-lg rounded-md overflow-hidden -ml-10 border">

              <Link
                to={`/add-leadManagement/${row?._id}`}
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
    "Email": true,
    "Role": true,
    "Edit": canView || canUpdate || true,
    "Delete": canDelete || true,
    Actions: true
  });
  useEffect(() => {
    const savedColumns = localStorage.getItem('enquiryTableColumnsLeadManagement');
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('enquiryTableColumnsLeadManagement', JSON.stringify(visibleColumns));
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
      Actions: true
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
      {/* <div className=" w-full mx-auto container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
          <div className="search_boxes flex justify-between items-center">
            <h2 className="text-xl ml-1 font-semibold text-[#2a2929]">Lead Management List</h2>

            <div className="flex items-center justify-start gap-2">
              <div className="w-full flex items-center ">
                <input
                  type="search"
                  className="rounded-md w-[250px] border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search by User Name"
                  onChange={(e) => setQuery(e.target.value)}
                />
                {/* <div className="relative right-8">
                  <IoSearchOutline />
                </div> */}
              {/* </div>


              <div className="relative">
                <button
                  className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                >
                  <FaColumns /> Columns
                </button>
                {showColumnSelector && <ColumnSelector />}
              </div>

              <button
                onClick={() => navigate(`/add-leadManagement`)}
                className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
              >
                <FaPlus />
                <span>New Lead Management</span>
              </button>
            </div>
          </div> */} 

        <NewTable
            data={LeadManagementData?.data}
            columns={filteredColumns}
            selectableRows={true}
            loading={false}
            totalRows={LeadManagementData?.total}
            onChangeRowsPerPage={setPageSize}
            onChangePage={setPageIndex}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}

            onSelectedRowsChange={handleChange}
        className={"leadtable"}
        //new fields
        TableName={"Lead Management"}
        TableGetAllFunction={useLeadManagement}
        ExcelExportFunction={getleadManagementExcel}
        TableAddExcelFunction={addleadManagementExcel}
        RouteName={"Lead Management"}
        AddButtonRouteName={"/add-leadManagement"}
        AddButtonName={"New Lead"}
        placeholderSearch={"Search in Lead"}

          />
       
    </>
  );
}

export default LeadManagement;



