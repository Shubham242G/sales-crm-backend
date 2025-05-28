import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaColumns } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import {
  useTaskManagementById,
  useAddTaskManagement,
  useUpdateTaskManagementById,
  usedeleteTaskManagementById,
  useTaskManagement,
  useMyTask,
} from "@/services/tastManagement.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { getAuth } from "@/utils/auth";
import { io } from "socket.io-client";
import { Switch } from "@mui/material";

function MyTask() {
  const navigate = useNavigate();

  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Task");


  const [userId, setUserId] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [role, setRole] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [leadId, setLeadId] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  const { data: TaskManagementData } = useMyTask(searchObj);
  const { mutateAsync: deleteTaskManagement } = usedeleteTaskManagementById();
  const { mutateAsync: updateTaskManagement } = useUpdateTaskManagementById();
  // const { mutateAsync: convert } = convertToContact();

  const CurrentUser = async () => {
    const decodedToken = await getAuth();
    setUserId(decodedToken.user?._id || "");
    setRole(decodedToken.role);
  };

  useEffect(() => {
    CurrentUser();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const { data: res } = await deleteTaskManagement(id);
        if (res) {
          toastSuccess(res.message);
          // Optionally refresh the data
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const getUserId = async () => {
    const decodedToken = await getAuth();
    if (decodedToken?.token) {
      setUserId(decodedToken.userId);
    }
  };





  useEffect(() => {
    getUserId();
  }, [getAuth]);


  useEffect(() => {
    if (!userId) return; // Wait until userId is available


    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      query: { userId }, // Send userId to the server
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
    });

    newSocket.emit("playerConnected", newSocket.id);

    setSocket(newSocket); // Store socket in state

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, [userId]);

  // const socket = useMemo(
  //   () =>
  //     io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  //       query: { userId }, // Send userId to the server
  //       transports: ["websocket"],
  //     }),
  //   []
  // );

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Connected to server");
  //   });
  //   socket.emit("playerConnected", socket.id);
  //   socket.on("check", (msg) => console.log(msg, "check msg"));
  // }, [socket, getAuth]);

  // const getUserId = async () => {
  //   const decodedToken = await getAuth();
  //   if (decodedToken?.token) {
  //     setUserId(decodedToken.userId);
  //   }
  // };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const { data: res } = await updateTaskManagement({ id, ...data });
      if (res) {
        toastSuccess(res.message);
        // Optionally refresh the data
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    getUserId();
  }, [getAuth]);

  // useEffect(() => {
  //   if (TaskManagementData?.data) {
  //     const filterData =
  //       role !== "ADMIN"
  //         ? TaskManagementData.data.filter((task: any) => {
  //             console.log(task.userId, userId, "check task user id");

  //             task.userId === userId;
  //           })
  //         : TaskManagementData.data;
  //     setFilteredData(filterData);
  //   }
  // }, [TaskManagementData, userId]);

  const columns = [
    {
      name: "Assigned To",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.assignedToName ?? "NA"}</h6>
        </div>
      ),
      width: "25%",
    },
    // {
    //   name: "Contact Owner",
    //   selector: (row: any) => <div className="flex gap-1">{row.ownerName}</div>,
    //   width: "12%",
    // },
    {
      name: "Department",
      selector: (row: any) => (
        <div className="flex gap-1">
          <h6>{row.department}</h6>
        </div>
      ),
      width: "20%",
    },
    {
      name: "Task Type",
      selector: (row: any) => <div className="flex gap-1">{row.taskType}</div>,
      width: "20%",
    },
    {
      name: "Task Title",
      selector: (row: any) => row.taskTitle,
      width: "20%",
    },

    {
      name: "Reassign",
      width: "15%",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => navigate(`/add-TaskManagement/${row._id}`)}
          className=" font-bold text-lg rounded-md "
        >
          🔁
        </button>
      ),
    },

    // {
    //   name: "Edit",
    //   width: "5%",
    //   selector: (row: any) =>
    //     (canView || canUpdate) && (
    //       <Link
    //         to={`/add-TaskManagement/${row._id}`}
    //         onClick={() => handleUpdate(row._id, row.data)}
    //         className="text-black-500 text-lg p-[6px]"
    //       >
    //         <FaEye />
    //       </Link>
    //     ),
    // },
    // {
    //   name: "Delete",
    //   width: "8%",
    //   selector: (row: any) =>
    //     canDelete && (
    //       <button
    //         type="button"
    //         onClick={() => handleDelete(row._id)}
    //         className="p-[6px] text-black-400 text-lg"
    //       >
    //         <RiDeleteBin6Line />
    //       </button>
    //     ),
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


  // Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    "Assigned To": true,
    "Department": true,
    "Task Type": true,
    "Task Title": true,
    "Reassign": true,
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
      "Assigned To": true,
      "Department": true,
      "Task Type": true,
      "Task Title": true,
      "Reassign": true,
    });
  };


  return (
    <>
     
        <div className="bg-white table_container rounded-xl p-6 mt-10">
          <div className="search_boxes flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Task Management List
            </h2>

            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full flex items-center ">
                <input
                  type="search"
                  onChange={(e) => setQuery(e.target.value)}
                  className="rounded-md w-[250px] border px-4 border-gray-300 py-2  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search by Assigned To"
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

              {/* <button className="flex items-center gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button> */}

              {canCreate && (
                <button
                  onClick={() => navigate("/add-TaskManagement")}
                  className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
                >
                  <FaPlus />
                  <span>New TaskManagement</span>
                </button>
              )}
            </div>
          </div>
          <div className="mt-5">
            <ReactTable
              data={TaskManagementData.data}
              columns={filteredColumns}
              loading={false}
              totalRows={TaskManagementData?.total}
              onChangeRowsPerPage={setPageSize}
              onChangePage={setPageIndex}
              page={pageIndex}
              rowsPerPageText={pageSize}
              isServerPropsDisabled={false}
            />

          </div>


        </div>
      
    </>
  );
}

export default MyTask;