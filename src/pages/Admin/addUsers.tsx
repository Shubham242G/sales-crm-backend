import { toastError, toastSuccess } from "@/utils/toast";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Phone } from "lucide-react";
import {
  useAddUser,
  useUserById,
  useUpdateUser,
} from "@/services/user.service";
import { generatePassword } from "@/utils/passwordGenerator";
import { useRoles } from "@/services/roles.service";
import { checkPermissionsForButtons } from "@/utils/permission";
import FixedActionButtons from "@/_components/buttons/page";


export const inputStyle = "border rounded-md px-3 py-2 text-sm flex-1 w-1/2 placeholder-gray-400 hover:border-blue-500 focus-within:ring-1 focus-within:ring-light-blue-500"
const AddNewUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    phone: "",
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
        phone: UserDataById.phone || "",
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

      console.log(formData.password, "Password",);
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
          console.log(formData.password, "Password", formData);
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
    <div className="w-[40%]  p-6 rounded-md-md text-sm mt-16">
      <div className="shadow-md rounded-md p-8">
        <h1 className="text-2xl font-semibold  mb-6">Add New User</h1>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          {/* Name */}
          <div className="flex items-center space-x-4">
            <label className="font-medium w-32">Name<span className="text-red-600">*</span></label>
            <input
              type="text"
              value={formData.name}
              required
              name="name"
              onChange={(e) => {
                const upperCaseValue = e.target.value.toUpperCase();
                setFormData(prev => ({ ...prev, name: upperCaseValue }));
              }}
              placeholder="Enter full name"
              className={inputStyle}
            />
          </div>

          {/* Email */}
          <div className="flex items-center space-x-4">
            <label className="font-medium w-32">Email Address<span className="text-red-600">*</span></label>
            <input
              type="email"
              value={formData.email}
              required
              name="email"
              onChange={(e) => {
                const lowerCaseValue = e.target.value.toLowerCase();
                setFormData(prev => ({ ...prev, email: lowerCaseValue }));
              }}
              placeholder="Enter email address"
              className="border rounded-md px-3 py-2 text-sm flex-1 w-1/2 placeholder-gray-400 hover:border-[#3b82f6] focus-within:ring-1 focus-within:ring-light-blue-500"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-4">
            <label className="font-medium w-32">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              name="phone"
              onChange={(e) => {
                const cleanedValue = e.target.value.replace(/\D/g, "");
                if (cleanedValue.length <= 10) {
                  setFormData(prev => ({ ...prev, phone: cleanedValue }));
                }
              }}
              placeholder="Enter phone number"
              className="border rounded-md px-3 py-2 text-sm flex-1 w-1/2 placeholder-gray-400 hover:border-blue-500 focus-within:ring-1 focus-within:ring-light-blue-500"
            />
          </div>

          {/* Role */}
          <div className="flex items-center space-x-4">
            <label className="font-medium w-32">Role</label>
            <select
              name="role"
              onChange={handleInputChange}
              value={formData.role}
              className="border rounded-md px-3 py-2 text-sm flex-1 w-1/2 hover:border-blue-500 focus-within:ring-1 focus-within:ring-light-blue-500"
            >
              <option value="" disabled hidden>Select a Role</option>
              {roleOptions.map((option: any) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">

            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1.5 px-3 rounded"
            >
              Save
            </button>

            <button
              onClick={() => navigate("/users")}
              className="border border-gray-300 text-sm text-black font-medium  rounded hover:bg-gray-100 py-1.5 px-3"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>



    </div>
  );
};

export default AddNewUser;
