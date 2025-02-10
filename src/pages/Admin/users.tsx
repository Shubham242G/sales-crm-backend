import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { useUser, useDeleteUser } from "@/services/user.service";
import { toastError, toastSuccess } from "@/utils/toast";

function Users() {
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

  const { data: UserData } = useUser(searchObj);
  console.log(UserData, "check UserData");
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

  const columns = [
    {
      name: "Name",
      selector: (row: any) => row?.name || "N/A",
      width: "20%",
    },
    {
      name: "Email",
      selector: (row: any) => row?.email || "N/A",
      width: "20%",
    },
    {
      name: "Role",
      selector: (row: any) => row?.role || "N/A",
      width: "15%",
    },
    {
      name: "Edit",
      width: "10%",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => navigate(`/add-users/${row._id}`)}
          className="text-black-500 text-lg p-[6px]"
        >
          <FaEye />
        </button>
      ),
    },
    {
      name: "Delete",
      width: "10%",
      selector: (row: any) => (
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

  return (
    <>
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
          <div className="search_boxes flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Users List</h2>

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
