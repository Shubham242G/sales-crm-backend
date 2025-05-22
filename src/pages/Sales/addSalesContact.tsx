import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddSalesContact,
  useSalesContactById,
  useUpdateSalesContactById,
} from "@/services/salesContact.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";

const AddSalesContact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    leadId: "",
    phone: "",
    email: "",
    salutation: "",
    company: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: addSalesContact } = useAddSalesContact();
  const { mutateAsync: updateSalesContact } = useUpdateSalesContactById();
  const { data: salesContactDataById, isLoading } = useSalesContactById(
    id || ""
  );
  const { canView, canUpdate, canCreate } =
    checkPermissionsForButtons("Sales Contacts");

  const salutationOptions = [
    { value: "Mr", label: "Mr." },
    { value: "Ms", label: "Ms." },
    { value: "Mrs", label: "Mrs." },
  ];

  useEffect(() => {
    if (salesContactDataById) {
      setFormData(salesContactDataById?.data || "");
    }
  }, [salesContactDataById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.firstName) {
        toastError("First name is required");
        return;
      }
      if (!formData.lastName) {
        toastError("Last name is required");
        return;
      }
      if (!formData.phone) {
        toastError("Phone Number is required");
        return;
      }

      const obj = formData;

      if (id) {
        const { data: res } = await updateSalesContact({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/sales-contact-view");
        }
      } else {
        const { data: res } = await addSalesContact(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/sales-contact-view");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    firstName: string,
    lastName: string,
    name: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [firstName]: value,
      [lastName]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {id ? "Update" : "Add"} Sales Contact
            </h1>
            <div className="h-px bg-gray-200 w-full mb-6"></div>

            {/* Basic Information Section */}
            <div className="bg-[#FAFAFA] border border-[#D1D1D1] rounded-lg p-6 mb-8">
              <h2 className="text-lg font-bold mb-6">Basic Information</h2>

              <div className="space-y-6">
                {/* Primary Contact */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Primary Contact:
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <select
                      name="salutation"
                      value={formData.salutation}
                      onChange={handleInputChange}
                      className="w-24 bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="">Sal.</option>
                      {salutationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="flex-1 min-w-[140px] bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                      required
                      type="text"
                    />
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="flex-1 min-w-[140px] bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                      required
                      type="text"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company:
                  </label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address:
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 pl-10 text-sm"
                        type="email"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number:
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 pl-10 text-sm"
                        required
                        type="tel"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            {((!id && canCreate) || (id && canUpdate)) && (
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                {id ? "Update" : "Save"} Contact
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalesContact;
