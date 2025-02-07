import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { usedeleteRolesById, useRoles } from "@/services/roles.service";
import { toastError, toastSuccess } from "@/utils/toast";

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
  //   console.log(RoleData, "check role data");
  const { mutateAsync: deleteRoles } = usedeleteRolesById();

  // Mock Data
  //   const roleData = [
  //     { id: 1, roleName: "Accountant Payable", description: "" },
  //     { id: 2, roleName: "Accountant Receivable", description: "" },
  //     { id: 3, roleName: "Accounts Team Leader", description: "" },
  //     {
  //       id: 4,
  //       roleName: "Admin",
  //       description: "Unrestricted access to all modules.",
  //     },
  //     { id: 5, roleName: "HR", description: "" },
  //     { id: 6, roleName: "MIS", description: "" },
  //     { id: 7, roleName: "Operations Head", description: "" },
  //     { id: 8, roleName: "Operations Team", description: "" },
  //     { id: 9, roleName: "Sales Team", description: "" },
  //     {
  //       id: 10,
  //       roleName: "Staff",
  //       description:
  //         "Access to all modules except reports, settings, and accountant.",
  //     },
  //   ];

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const { data: res } = await deleteRoles(id);
        if (res) {
          toastSuccess(res.message);
          // Optionally refresh the data
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const columns = [
    {
      name: "Role Name",
      selector: (row: any) => row.roleName,
      width: "40%",
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      width: "40%",
    },
    {
      name: "Actions",
      width: "20%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/add-role/${row.id}`)}
            className="text-black-500 text-lg p-[6px]"
          >
            <FaEye />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            className="p-[6px] text-black-400 text-lg"
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container px-6">
      <div className="bg-white table_container rounded-xl shadow-xl p-6">
        <div className="search_boxes flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Roles List</h2>
          <div className="flex items-center justify-start gap-2">
            <div className="w-full flex items-center">
              <input
                type="search"
                className="rounded-md w-[250px] border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search by role name"
              />
              <div className="relative right-8">
                <IoSearchOutline />
              </div>
            </div>
            <button
              onClick={() => navigate("/add-role")}
              className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
            >
              <FaPlus />
              <span>New Role</span>
            </button>
          </div>
        </div>
        <ReactTable
          data={roleData?.data}
          columns={columns}
          loading={false}
          totalRows={roleData?.total}
        />
      </div>
    </div>
  );
}

export default Roles;
