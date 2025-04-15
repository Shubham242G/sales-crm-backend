import { useState, useEffect, useMemo } from "react";
import { FaPlus, FaSave } from "react-icons/fa";
import {
  useAddRoles,
  useRoles,
  useRolesById,
  useUpdateRolesById,
} from "@/services/roles.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";

// Permission types
interface Permissions {
  create: boolean;
  view: boolean;
  update: boolean;
  delete: boolean;
}

// Role model
interface Role {
  roleName: string;
  description: string;
  routePermissions: RoutePermission[];
  name: string;
  email: string;
  phoneNo: string;
  designation: string;
  department: string;
  parentRoleName?: string; 
}

// Permissions for each route
interface RoutePermission {
  routeName: string;
  permissions: Permissions;
  isEditing?: boolean;
}

function AddRoles() {
  const [roleName, setRoleName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [permissions, setPermissions] = useState<RoutePermission[]>([
    {
      routeName: "Customers",
      permissions: { create: false, view: false, update: false, delete: false },
    },
    {
      routeName: "Vendors",
      permissions: { create: false, view: false, update: false, delete: false },
    },
    {
      routeName: "RFPS",
      permissions: { create: false, view: false, update: false, delete: false },
    },
    {
      routeName: "Add Department",
      permissions: { create: false, view: false, update: false, delete: false },
    },
    {
      routeName: "Add Category",
      permissions: { create: false, view: false, update: false, delete: false },
    },
  ]);
   const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [query, setQuery] = useState("");
    const searchObj = useMemo(
      () => ({
        ...(query && { query }),
        pageIndex: pageIndex - 1,
        pageSize,
      }),
      [pageIndex, pageSize, query]
    );

  const {data: allRolesData} = useRoles(searchObj);
  console.log(allRolesData?.data, "all roles data");
const [parentRoleName, setParentRoleName] = useState<string>("");

const allRoles = allRolesData?.data || [];





  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: addRoles } = useAddRoles();
  const { mutateAsync: updateRoles } = useUpdateRolesById();
  const { data: roleDataById } = useRolesById(id || "");

  useEffect(() => {
    if (roleDataById) {
      setRoleName(roleDataById?.data?.roleName);
      setDescription(roleDataById?.data?.description);
      setName(roleDataById?.data?.name);
      setEmail(roleDataById?.data?.email);
      setPhoneNo(roleDataById?.data?.phoneNo);
      setDesignation(roleDataById?.data?.designation);
      setDepartment(roleDataById?.data?.department);
      setPermissions(roleDataById?.data?.routePermissions);
      setParentRoleName(roleDataById?.data?.parentRoleName || "");
    }
  }, [roleDataById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!roleName || !description || !name ||  !designation || !department){
      return toastError("Please fill all the fields");
    }
    try {
      const newRole: Role = {
        roleName,
        description,
        name,
        phoneNo,
        email,
        designation,
        department,
        routePermissions: permissions,
        parentRoleName
      };

      if (id) {
        const { data: res } = await updateRoles({ id, obj: newRole });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/roles");
        }
      } else {
        const { data: res } = await addRoles(newRole);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/roles");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleAddNewRoute = () => {
    setPermissions((prev) => [
      ...prev,
      {
        routeName: "",
        permissions: {
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        isEditing: true,
      },
    ]);
  };

  const handleRouteNameChange = (index: number, newRouteName: string) => {
    setPermissions((prev) =>
      prev.map((rp, i) =>
        i === index ? { ...rp, routeName: newRouteName } : rp
      )
    );
  };

  const handleRouteBlur = (index: number) => {
    setPermissions((prev) =>
      prev.map((rp, i) => (i === index ? { ...rp, isEditing: false } : rp))
    );
  };

  const handleEditClick = (index: number) => {
    setPermissions((prev) =>
      prev.map((rp, i) => (i === index ? { ...rp, isEditing: true } : rp))
    );
  };

  const handleDeleteRoute = (index: number) => {
    setPermissions((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePermissionChange = (
    index: number,
    permissionType: keyof Permissions
  ) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((rp, i) =>
        i === index
          ? {
              ...rp,
              permissions: {
                ...rp.permissions,
                [permissionType]: !rp.permissions[permissionType],
              },
            }
          : rp
      )
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Role" : "Add New Role"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="Enter Name"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="Enter Email Address"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Phone Number</label>
          <input
            type="number"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="Enter Phone Number"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="Enter Department"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="Enter Designation"
          />
        </div>

        <div>

       
        <Autocomplete
  options={allRoles.map((r:any) => r.roleName).filter((r:any) => r !== roleName)}
  value={parentRoleName}
  onChange={(_, newValue) => setParentRoleName(newValue || "")}
  renderInput={(params) => (
    <TextField {...params} label="Parent Role (for hierarchy)" />
  )}
/>
</div>
        <div>
          <label className="block font-medium mb-4">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value.toUpperCase())}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="Enter Role Name"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="Enter Role Description"
          ></textarea>
        </div>

        {/* Permissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 w-1/5">Routes</th>
                <th className="border border-gray-300 p-2 w-2/5" colSpan={4}>
                  Permissions
                </th>
                <th className="border border-gray-300 p-2 w-2/5" colSpan={4}>
                  Actions
                </th>
                {/* <th className="border border-gray-300 p-2 w-[10%]">Edit</th>
                <th className="border border-gray-300 p-2 w-[10%]">Delete</th> */}
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2"></th>
                <th className="border border-gray-300 p-2 w-[17%]">Create</th>
                <th className="border border-gray-300 p-2 w-[17%]">View</th>
                <th className="border border-gray-300 p-2 w-[17%]">Update</th>
                <th className="border border-gray-300 p-2 w-[17%]">Delete</th>
                <th className="border border-gray-300 p-2 w-[6%]">Edit</th>
                <th className="border border-gray-300 p-2 w-[10%]">Delete</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((rp, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-medium">
                    {rp.isEditing ? (
                      <input
                        type="text"
                        value={rp.routeName}
                        onChange={(e) =>
                          handleRouteNameChange(index, e.target.value)
                        }
                        onBlur={() => handleRouteBlur(index)}
                        className="w-full p-1 border rounded"
                        placeholder="Enter route name"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>{rp.routeName}</span>
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={rp.permissions.create}
                      onChange={() => handlePermissionChange(index, "create")}
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={rp.permissions.view}
                      onChange={() => handlePermissionChange(index, "view")}
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={rp.permissions.update}
                      onChange={() => handlePermissionChange(index, "update")}
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={rp.permissions.delete}
                      onChange={() => handlePermissionChange(index, "delete")}
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      type="button"
                      className="text-orange-500 hover:underline"
                      onClick={() => handleEditClick(index)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      type="button"
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteRoute(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="mt-4 flex items-center px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={handleAddNewRoute}
          >
            <FaPlus className="mr-2" /> Add New Route
          </button>
        </div>

        <div>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <FaSave className="mr-2" /> Save Role
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRoles;
