import { toastError, toastSuccess } from "@/utils/toast";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddLead,
  useLead,
  useLeadById,
  useUpdateLeadById,
} from "@/services/lead.service";
import { checkPermissionsForButtons } from "@/utils/permission";

const AddNewLead = () => {
  const [formData, setFormData] = useState({
    //new fields
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });

  const { id } = useParams();

  const navigate = useNavigate();
  const { mutateAsync: addLead } = useAddLead();
  const { mutateAsync: updateLead } = useUpdateLeadById();
  const { data: leadDataById } = useLeadById(id || "");

  const { canCreate, canView, canUpdate } = checkPermissionsForButtons("Leads");

  useEffect(() => {
    if (leadDataById && leadDataById.data) {
      setFormData({
        salutation: leadDataById.data.salutation || "",
        firstName: leadDataById.data.firstName || "",
        lastName: leadDataById.data.lastName || "",
        email: leadDataById.data.email || "",
        phone: leadDataById.data.phone || "",
        company: leadDataById.data.company || "",
      });
    }
  }, [leadDataById]);

  const salutationOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Ms", label: "Ms" },
    { value: "Mrs", label: "Mrs" },
    { value: "Dr", label: "Dr" },
  ];



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.firstName) {
        toastError("First Name is required");
        return;
      }

      if (!formData.lastName) {
        toastError("Last Name is required");
        return;
      }

      if (!formData.phone) {
        toastError("Phone Number is required");
        return;
      }

      const obj = formData;

      if (id) {
        const { data: res } = await updateLead({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/leads");
        }
      } else {
        const { data: res } = await addLead(obj);
        if (res?.message) {
          setFormData(obj);
          toastSuccess(res.message);
          navigate("/leads");
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

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white m-[32px] p-12">
      <div className="max-w-7xl mx-auto bg-gray-50  shadow-lg rounded-lg p-16">
        <h1 className="text-2xl font-bold mb-10">Add New Lead</h1>
        <form onSubmit={handleSubmit}>
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] mb-10">
            {/* Salutation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salutation
              </label>
              <select
                onChange={(val) =>
                  handleSelectChange("salutation", val.target.value)
                }
                value={formData.salutation}
                className="border  border-gray-300 bg-gray-50 rounded-md p-4 w-full text-gray-500 placeholder-gray-400"
              >
                <option value="" disabled hidden className=" text-gray-400 ">
                  Salutation
                </option>
                {salutationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* First Name */}
            <div>
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
                className="w-full bg-gray-50 border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div>

            {/* Last Name */}
            <div>
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
                className="w-full bg-gray-50 border border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div>

            {/* Company Name */}
            <div>
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
                className="w-full border bg-gray-50 border-gray-300 rounded-md p-4 placeholder-gray-400"
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
                className="w-full border bg-gray-50 border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div>

            {/* Mobile Number */}
            <div>
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
                className="w-full border bg-gray-50 border-gray-300 rounded-md p-4 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-8">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            {((!id && canCreate) || (id && canUpdate)) && (
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
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

export default AddNewLead;
