import { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import {
  useAddRoles,
  useRolesById,
  useUpdateRolesById,
} from "@/services/roles.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { useNavigate, useParams } from "react-router-dom";

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
}

// Permissions for each route
interface RoutePermission {
  routeName: string;
  permissions: Permissions;
}

function AddRoles() {
  const [roleName, setRoleName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [permissions, setPermissions] = useState<RoutePermission[]>([
    {
      routeName: "Customers",
      permissions: { create: false, view: false, update: false, delete: false },
    },
    {
      routeName: "Operations",
      permissions: { create: false, view: false, update: false, delete: false },
    },
    {
      routeName: "Moderators",
      permissions: { create: false, view: false, update: false, delete: false },
    },
    {
      routeName: "Marketing",
      permissions: { create: false, view: false, update: false, delete: false },
    },
    {
      routeName: "Sub-Admin",
      permissions: { create: false, view: false, update: false, delete: false },
    },
  ]);

  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: addRoles } = useAddRoles();
  const { mutateAsync: updateRoles } = useUpdateRolesById();
  const { data: roleDataById } = useRolesById(id || "");

  useEffect(() => {
    if (roleDataById) {
      setRoleName(roleDataById?.data?.roleName);
      setDescription(roleDataById?.data?.description);
      setPermissions(roleDataById?.data?.routePermissions);
    }
  }, [roleDataById]);

  const handlePermissionChange = (
    routeName: string,
    permissionType: keyof Permissions
  ) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((routePermission) =>
        routePermission.routeName === routeName
          ? {
              ...routePermission,
              permissions: {
                ...routePermission.permissions,
                [permissionType]: !routePermission.permissions[permissionType],
              },
            }
          : routePermission
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRole: Role = {
        roleName,
        description,
        routePermissions: permissions,
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Role" : "Add New Role"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="Enter role name"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="Enter role description"
          ></textarea>
        </div>

        {/* Permissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 w-1/3">Routes</th>
                <th className="border border-gray-300 p-2 w-2/3" colSpan={4}>
                  Permissions
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2"></th>
                <th className="border border-gray-300 p-2 w-[17%]">Create</th>
                <th className="border border-gray-300 p-2 w-[17%]">View</th>
                <th className="border border-gray-300 p-2 w-[17%]">Update</th>
                <th className="border border-gray-300 p-2 w-[17%]">Delete</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map(({ routeName, permissions }) => (
                <tr key={routeName} className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-medium">
                    {routeName}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={permissions.create}
                      onChange={() =>
                        handlePermissionChange(routeName, "create")
                      }
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={permissions.view}
                      onChange={() => handlePermissionChange(routeName, "view")}
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={permissions.update}
                      onChange={() =>
                        handlePermissionChange(routeName, "update")
                      }
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={permissions.delete}
                      onChange={() =>
                        handlePermissionChange(routeName, "delete")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          <FaSave className="mr-2" /> {id ? "Update Role" : "Save Role"}
        </button>
      </form>
    </div>
  );
}

export default AddRoles;
