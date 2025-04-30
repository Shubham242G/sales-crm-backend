import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { RiDeleteBin6Line, RiH6 } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { usedeleteRolesById, useRoles } from "@/services/roles.service";
import { toastError, toastSuccess } from "@/utils/toast";
import RoleHierarchy from "@/pages/Hierarchy/roleHierarchy";



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
      selector: (row: any) =>(<h6>{ row.name}</h6>),
      width: "25%",
    },
    {
      name: "Role",
      selector: (row: any) =>(<h6>{ row.roleName}</h6>),
      width: "25%",
    },
    
    {
      name: "Hierarchy",
      selector: (row: any) => (row.hierarchy ? <h6>{row.hierarchy}</h6> : <h6>{"N/A"}</h6>),
      width: "20%",
    },
    {
      name: "Edit",
      width: "15%",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => navigate(`/add-role/${row._id}`)}
          className="text-black-500 text-lg  hover:text-orange-500"
        >
          <FaEye  />
        </button>
      ),
    },
    {
      name: "Delete",
      width: "15%",
      selector: (row: any) => (
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
      <RoleHierarchy />
 
   
    </div>
  );
}

export default Roles;