import { toastError, toastSuccess } from "@/utils/toast";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  useAddUser,
  useUserById,
  useUpdateUser,
} from "@/services/user.service";
import { generatePassword } from "@/utils/passwordGenerator";
import { useRoles } from "@/services/roles.service";
import { checkPermissionsForButtons } from "@/utils/permission";

const AddNewUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { canView, canUpdate, canCreate } = checkPermissionsForButtons("User");

  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: addUser } = useAddUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { data: UserDataById } = useUserById(id);
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

  const { data: rolesResponse } = useRoles(searchObj);

  useEffect(() => {
    if (id && UserDataById) {
      setFormData({
        name: UserDataById.name || "",
        email: UserDataById.email || "",
        role: UserDataById.role || "",
        password: UserDataById.password || "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        password: generatePassword(),
      }));
    }
  }, [UserDataById, id]);


  // const roleOptions = [
  //   { value: "Customer", label: "Customer" },
  //   { value: "Operations", label: "Operations" },
  //   { value: "Moderators", label: "Moderators" },
  //   { value: "Marketing", label: "Marketing" },
  //   { value: "Sub-Admin", label: "Sub-Admin" },
  // ];


  const roleOptions =
    rolesResponse?.data?.map((role: any) => ({
      value: role.roleName,
      label: role.roleName,
    })) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obj = formData;
      if (id) {
        const { data: res } = await updateUser({ id, ...obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/users");
        }
      } else {
        const { data: res } = await addUser(obj);
        if (res?.message) {
          setFormData(obj);
          toastSuccess(res.message);
          navigate("/users");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-12">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-16">
        <h1 className="text-2xl font-bold mb-10">Add New User</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                name="name"
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div>

            {/* <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                name="password"
                onChange={handleInputChange}
                placeholder="Enter password"
                readOnly={!id}
                className="w-full border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
              <div
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer mt-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                onChange={handleInputChange}
                value={formData.role}
                className="border border-gray-300 rounded-md p-4 w-full"
              >
                <option value="" disabled hidden>
                  Select a Role
                </option>
                {roleOptions.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-8">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700"
              onClick={() => navigate("/users")}
            >
              Cancel
            </button>
            {((!id && canCreate) || (id && canUpdate)) && (
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 text-white rounded-md"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
