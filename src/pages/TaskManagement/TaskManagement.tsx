import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import {
  useTaskManagementById,
  useAddTaskManagement,
  useUpdateTaskManagementById,
  usedeleteTaskManagementById,
  useTaskManagement,
} from "@/services/tastManagement.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { getAuth } from "@/utils/auth";
import { io } from "socket.io-client";

function TaskManagement() {
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
  const [filteredData, setFilteredData] = useState("");
  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  const { data: TaskManagementData } = useTaskManagement(searchObj);
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
      width: "18%",
    },
    {
      name: "Contact Owner",
      selector: (row: any) => <div className="flex gap-1">{row.ownerName}</div>,
      width: "12%",
    },
    {
      name: "Department",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className="text-[#938d8d]" />
          {row.department}
        </div>
      ),
      width: "15%",
    },
    {
      name: "Task Type",
      selector: (row: any) => <div className="flex gap-1">{row.taskType}</div>,
      width: "18%",
    },
    {
      name: "Task Title",
      selector: (row: any) => row.taskTitle,
      width: "15%",
    },

    {
      name: "Reassign",
      width: "10%",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => navigate(`/add-TaskManagement/${row._id}`)}
          className="text-blue-500 text-lg p-[6px]"
        >
          Reassign
        </button>
      ),
    },

    {
      name: "Edit",
      width: "5%",
      selector: (row: any) =>
        (canView || canUpdate) && (
          <Link
            to={`/add-TaskManagement/${row._id}`}
            onClick={() => handleUpdate(row._id, row.data)}
            className="text-black-500 text-lg p-[6px]"
          >
            <FaEye />
          </Link>
        ),
    },
    {
      name: "Delete",
      width: "8%",
      selector: (row: any) =>
        canDelete && (
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
            className="p-[6px] text-black-400 text-lg"
          >
            <RiDeleteBin6Line />
          </button>
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

  return (
    <>
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
          <div className="search_boxes flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Task Management List
            </h2>

            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full flex items-center ">
                <input
                  type="search"
                  className="rounded-md w-[250px] border px-4 border-gray-300 py-2  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search by contact name"
                />
                <div className="relative right-8">
                  <IoSearchOutline />
                </div>
              </div>

              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button>

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

          <ReactTable
            data={TaskManagementData.data}
            columns={filterColumns}
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

export default TaskManagement;