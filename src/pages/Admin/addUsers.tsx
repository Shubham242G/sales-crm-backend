import { toastError, toastSuccess } from "@/utils/toast";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddUser,
  useUser,
  useUserById,
  useUpdateUser,
} from "@/services/user.service";
import { errorMessages } from "vue/compiler-sfc";
import { error } from "console";

const AddNewUser = () => {
  const [formData, setFormData] = useState({
    //new fields

    name: "",
    email: "",
    role: "",
  });

  const { id } = useParams();

  const navigate = useNavigate();
  const { mutateAsync: addUser } = useAddUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { data: UserDataById } = useUserById(id);

  console.log(UserDataById, "check user data by id ");

  useEffect(() => {
    if (UserDataById) {
      console.log("Fetched user data:", UserDataById);
      setFormData({
        name: UserDataById.name || "",
        email: UserDataById.email || "",
        role: UserDataById.role || "",
      });
    } else {
      console.log(errorMessages, "error faced");
    }
  }, [UserDataById]);

  const roleOptions = [
    { value: "Customer", label: "Customer" },
    { value: "Operations", label: "Operations" },
    { value: "Moderators", label: "Moderators" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sub-Admin", label: "Sub-Admin" },
  ];

  console.log(formData, "check form data");
  console.log(UserDataById, "check User by data id");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //   if (!formData.firstName) {
      //     toastError("First Name is required");
      //     return;
      //   }

      //   if (!formData.lastName) {
      //     toastError("Last Name is required");
      //     return;
      //   }

      //   if (!formData.phone) {
      //     toastError("Phone Number is required");
      //     return;
      //   }

      const obj = formData;

      if (id) {
        const { data: res } = await updateUser({ id });
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
      console.log(obj, "check obj");
      console.log(formData, "check form data");
    } catch (error) {
      toastError(error);
    }
    console.log("FormDataaaa:-->", formData);
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

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-12">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-16">
        <h1 className="text-2xl font-bold mb-10">Add New User</h1>
        <form onSubmit={handleSubmit}>
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            {/* First Name */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name={"firstName"}
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Enter first name"
                className="w-full border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div> */}

            {/* Last Name */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                name={"lastName"}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                type="text"
                placeholder="Enter last name"
                className="w-full border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div> */}

            {/* Company Name */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                name={"company"}
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                type="text"
                placeholder="Enter company name"
                className="w-full border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div> */}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                name={"name"}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                name={"email"}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div>

            {/* Salutation */}
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
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Number */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                name={"phone"}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                type="text"
                placeholder="Enter mobile number"
                className="w-full border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div> */}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-8">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
