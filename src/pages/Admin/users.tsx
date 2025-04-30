import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { useUser, useDeleteUser, useUpdateUser } from "@/services/user.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { ClassNames } from "@emotion/react";

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
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

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
      selector: (row: any) => row?.name || "N/A",
      width: "25%",
    },
    {
      name: "Email",
      selector: (row: any) => row?.email || "N/A",
      width: "25%",
    },
    {
      name: "Role",
      selector: (row: any) => row?.role || "N/A",
      width: "20%",
      
    },
    {
      name: "Edit",
      width: "15%",
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
      width: "15%",
      selector: (row: any) =>
        canDelete && (
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
            className=" text-black-400 text-lg"
          >
            <RiDeleteBin6Line className="hover:text-red-600"/>
          </button>
        ),
    },
  ];

  return (
    <>
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
          <div className="search_boxes flex justify-between items-center">
            <h2 className="text-xl ml-1 font-semibold text-[#2a2929]">Users List</h2>

            <div className="flex items-center justify-start gap-2">
              <div className="w-full flex items-center ">
                <input
                  type="search"
                  className="rounded-md w-[250px] border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search by contact name"
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="relative right-8">
                  <IoSearchOutline />
                </div>
              </div>
              <button
                onClick={() => navigate("/add-users")}
                className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
              >
                <FaPlus />
                <span>New User</span>
              </button>
            </div>
          </div>

          <ReactTable
            data={UserData?.data}
            columns={columns}
            loading={false}
            totalRows={UserData?.total}
          />
        </div>
      </div>
    </>
  );
}

export default Users;
