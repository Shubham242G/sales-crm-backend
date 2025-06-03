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
  isRouteShow: boolean
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

  const permissionRoute = [
    "User",
    "Roles",
    "Vendors",
    "RFPS",
    "Quotes from Vendors",
    "Confirmed Quotes From Vendors",
    "Purchase Contacts",
    "Leads",
    "Customers",
    "Invoices",
    "Quotes for Customer",
    "Enquiry",
    "Invoice View",
    "Invoice Pdf View",
    "Confirmed Quotes Customer",
    "Customer Outstanding",
    "Sales Contacts",
    "Task Management",
    "My Tasks",
    "Add Department",
    "Add Category",
    "Add Hotel",
    "Add Banquet",
    "Add Resturant",
    "Venue Search",



  ];


  const [permissions, setPermissions] = useState<RoutePermission[]>([
    {
      routeName: "User",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Roles",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Vendors",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "RFPS",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Quotes from Vendors",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Confirmed Quotes From Vendors",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Purchase Contacts",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Leads",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Customers",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Quotes for Customer",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Enquiry",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Invoice View",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Invoice Pdf View",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Confirmed Quotes from Customer",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Invoices",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Customer Outstanding",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Sales Contacts",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Task Management",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "My Tasks",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Add Department",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Add Category",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Add Hotel",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Add Banquet",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Add Resturant",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    },
    {
      routeName: "Venue Search",
      permissions: {
        create: true,
        update: true,
        delete: true,
        view: true,
        isRouteShow: true,
      },
    }]);


  const filterRoutes = permissionRoute.filter((route) => !permissions.some((p) => p.routeName === route));
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

  const { data: allRolesData } = useRoles(searchObj);
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
    if (!roleName || !description || !name) {
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
          console.log(roleName, "rolename", name, "name",);
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
          isRouteShow: false
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
    <div className="  w-[100%]  mt-16 relative mb-24 p-6 pt-0 ">
      <div className="container h-[80vh] overflow-scroll   ">
        <h1 className="text-2xl font-bold mb-4 ml-3">
          {id ? "Edit Role" : "Add New Role"}
        </h1>

      <form onSubmit={handleSubmit} >
          <div className=" shadow-md  p-2 w-1/2 ml-2  rounded-md text-sm space-y-4 ">

            {/* Name */}
            <div className="flex items-center space-x-4">
              <label className="font-medium w-32  ml-4">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className="border rounded px-3 py-2 text-sm w-[60%] placeholder-gray-400 hover:border-blue-500 focus-within:ring-1 focus-within:ring-light-blue-500"
              />
            </div>

            {/* Parent Role */}
            <div className="flex items-center space-x-4">
              <label className="font-medium w-32 ml-4">Parent Role</label>
              <select
                value={parentRoleName}
                onChange={(e) => setParentRoleName(e.target.value || "")}
                className="border rounded px-3 py-2 text-sm w-[60%] placeholder-gray-400 hover:border-blue-500 focus-within:ring-1 focus-within:ring-light-blue-500"
              >
                <option value="">--Select Parent Role--</option>
                {allRoles
                  .map((r: any) => r.roleName)
                  .filter((r: any) => r !== roleName)
                  .map((role: any) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
              </select>
            </div>

            {/* Role Name */}
            <div className="flex items-center space-x-4">
              <label className="font-medium w-32 ml-4">Role Name</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value.toUpperCase())}
                placeholder="Enter Role Name"
                className="border rounded px-3 py-2 text-sm w-[60%] placeholder-gray-400 hover:border-blue-500 focus-within:ring-1 focus-within:ring-light-blue-500"
              />
            </div>

            {/* Description */}
            <div className="flex items-start space-x-4">
              <label className="font-medium w-32 ml-4 pt-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Role Description"
                rows={4}
                className="border rounded px-3 py-2 mb-4 text-sm w-[60%] placeholder-gray-400 hover:border-blue-500 focus-within:ring-1 focus-within:ring-light-blue-500"
              />
            </div>

          </div>


          {/* Permissions Table */}
          <div className="overflow-x-auto mt-4 ">
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
                        <>
                        <div className="flex justify-around items-center ">
                           <input
                            type="text"
                            list="routeNameList"
                            value={rp.routeName}
                            onChange={(e) =>
                              handleRouteNameChange(index, e.target.value)
                            }
                            onBlur={() => handleRouteBlur(index)}
                            className="w-full p-1 border rounded"
                            placeholder="Enter route name"
                            autoFocus
                          />
                          <datalist id="routeNameList">
                            {filterRoutes.map((rp, index) => (
                              <option key={index} value={rp} />
                            ))}
                          </datalist>
                        </div>
                         
                        </>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>{rp.routeName}</span>
                          <input
                          className="h-[10px] w-[10px]"
                            type="checkbox"
                            checked={rp.permissions.isRouteShow}
                            onChange={() =>
                              handlePermissionChange(index, "isRouteShow")
                            }
                          />
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
                        className="text-blue-500 hover:underline"
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
            <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t border-gray-200 shadow-md py-3 px-6 flex justify-between z-50">
              <button
                type="button"
                className="flex items-center px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                onClick={handleAddNewRoute}
              >
                <FaPlus className="mr-2" /> Add New Route
              </button>

              <button
                type="submit"
                className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <FaSave className="mr-2" /> Save Role
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoles;
