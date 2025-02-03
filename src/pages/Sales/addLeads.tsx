import { toastError, toastSuccess } from "@/utils/toast";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddLead, useLead, useLeadById, useUpdateLeadById } from "@/services/lead.service";
import { set } from "lodash";

const AddNewLead = () => {

  const [formData, setFormData] = useState({

    //new fields 
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',




  });




  const { id } = useParams();

  const navigate = useNavigate();
  const { mutateAsync: addLead } = useAddLead();
  const { mutateAsync: updateLead } = useUpdateLeadById();
  const { data: leadDataById, isLoading } = useLeadById(id || "");


  useEffect(() => {
    // Prefill form when editing
    if (leadDataById) {
      console.log(leadDataById, "getById/");
      setFormData(leadDataById?.data || "");

    }
  }, [leadDataById]);

  const salutationOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Ms", label: "Ms" },
    { value: "Mrs", label: "Mrs" },
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
          setFormData(obj)
          toastSuccess(res.message);
          navigate("/leads")

        }
      }
    } catch (error) {
      toastError(error);
    }
    console.log("FormDataaaa:-->", formData)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Lead</h1>
        <form onSubmit={handleSubmit}>
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Salutation */}
            <select onChange={(val) => handleSelectChange("salutation", val.target.value)} value={formData.salutation} className="border border-gray-300 rounded-md mt-6 px-4 py-2 w-20 mt-1">
              {salutationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name={"firstName"}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                name={"lastName"}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                type="text"
                placeholder="Enter last name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                name={"company"}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                type="text"
                placeholder="Enter company name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>


            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name={"email"}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                name={"phone"}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                type="text"
                placeholder="Enter mobile number"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewLead;
