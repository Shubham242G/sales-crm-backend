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
import { useUserName } from "@/services/user.service";

const AddNewLead = () => {
  const [formData, setFormData] = useState({
    //new fields
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    leadOwner: "",
    displayName: ""
  });

  const { id } = useParams();

  const navigate = useNavigate();
  const { mutateAsync: addLead } = useAddLead();
  const { mutateAsync: updateLead } = useUpdateLeadById();
  const { data: leadDataById } = useLeadById(id || "");
  const { data: userNames } = useUserName()
 

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
        leadOwner: leadDataById.data.leadOwner || "",
        displayName: leadDataById.data.displayName || "",

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
    // <div className="min-h-screen bg-white p-4 ">
    //   <div className="max-w-7xl mx-auto bg-gray-50  shadow-lg rounded-lg p-6 md:p-12">
    //     <h1 className="text-base font-semibold mb-6 md:text-lg md:mb-10">Add New Lead</h1>
    //     <form onSubmit={handleSubmit}>
    //       {/* Grid Layout for Form Fields */}
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10">
    //         {/* Salutation */}
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             Salutation
    //           </label>
    //           <select
    //             onChange={(val) =>
    //               handleSelectChange("salutation", val.target.value)
    //             }
    //             value={formData.salutation}
    //             className="border  border-gray-300 bg-gray-50 rounded-md p-2 md:p-4 w-full text-gray-500 placeholder-gray-400"
    //           >
    //             <option value="" disabled hidden className=" text-gray-400 ">
    //               Salutation
    //             </option>
    //             {salutationOptions.map((option) => (
    //               <option key={option.value} value={option.value}>
    //                 {option.label}
    //               </option>
    //             ))}
    //           </select>
    //         </div>

    //         {/* First Name */}
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             First Name
    //           </label>
    //           <input
    //             type="text"
    //             name={"firstName"}
    //             value={formData.firstName}
    //             onChange={(e) =>
    //               setFormData({ ...formData, firstName: e.target.value })
    //             }
    //             placeholder="Enter first name"
    //             className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Display Name */}
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             Display Name
    //           </label>
    //           <input
    //             name={"displayName"}
    //             value={formData.displayName}
    //             onChange={(e) =>
    //               setFormData({ ...formData, displayName: e.target.value })
    //             }
    //             type="text"
    //             placeholder="Enter display name"
    //             className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Lead Owner */}
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             Lead Owner
    //           </label>
    //           <select
    //             onChange={(val) =>
    //               handleSelectChange("leadOwner", val.target.value)
    //             }
    //             value={formData.leadOwner}
    //             className="border  border-gray-300 bg-gray-50 rounded-md p-2 md:p-4 w-full text-gray-500 placeholder-gray-400"
    //           >
    //             <option value="" disabled hidden className=" text-gray-400 ">
    //               Lead Owner
    //             </option>
    //             {userNames.data.map((option: any) => (
    //               <option key={option.value} value={option.label}>
    //                 {option.label}
    //               </option>
    //             ))}
    //           </select>
    //         </div>

    //         {/* Last Name */}
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             Last Name
    //           </label>
    //           <input
    //             name={"lastName"}
    //             value={formData.lastName}
    //             onChange={(e) =>
    //               setFormData({ ...formData, lastName: e.target.value })
    //             }
    //             type="text"
    //             placeholder="Enter last name"
    //             className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Company Name */}
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             Company Name
    //           </label>
    //           <input
    //             name={"company"}
    //             value={formData.company}
    //             onChange={(e) =>
    //               setFormData({ ...formData, company: e.target.value })
    //             }
    //             type="text"
    //             placeholder="Enter company name"
    //             className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Email Address */}
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             Email Address
    //           </label>
    //           <input
    //             type="email"
    //             value={formData.email}
    //             name={"email"}
    //             onChange={(e) =>
    //               setFormData({ ...formData, email: e.target.value })
    //             }
    //             placeholder="Enter email address"
    //             className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Mobile Number */}
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             Mobile Number
    //           </label>
    //           <input
    //             name={"phone"}
    //             value={formData.phone}
    //             onChange={(e) => {
    //               const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10); // ✅ Allow only digits and limit to 10
    //               setFormData({ ...formData, phone: numericValue });
    //             }}
    //             type="text"
    //             placeholder="Enter mobile number"
    //             className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>
    //       </div>

    //       {/* Buttons */}
    //       <div className="flex justify-end gap-6">
    //         <button
    //           type="button"
    //           className="px-6 py-3 border border-gray-300 rounded-md text-gray-700"
    //           onClick={() => navigate(-1)}
    //         >
    //           Cancel
    //         </button>
    //         {((!id && canCreate) || (id && canUpdate)) && (
    //           <button
    //             type="submit"
    //             className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
    //           >
    //             Save
    //           </button>
    //         )}
    //       </div>
    //     </form>
    //   </div>
    // </div>

    <div className=" bg-white p-4">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-lg font-semibold mb-8 text-[#101828]">Add New Lead</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Salutation */}
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Salutation</label>
              <select
                onChange={(val) => handleSelectChange("salutation", val.target.value)}
                value={formData.salutation}
                className="w-full border border-[#D0D5DD] bg-white rounded-md px-3 py-2.5 text-sm text-[#667085] focus:outline-none focus:ring-2 focus:ring-blue-500 h-[38px]"
              >
                <option value="" disabled hidden>Salutation</option>
                {salutationOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="First Name"
                className="w-full border border-[#D0D5DD] bg-white rounded-md px-3 py-2.5 text-sm text-[#344054] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[38px]"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Last Name"
                className="w-full border border-[#D0D5DD] bg-white rounded-md px-3 py-2.5 text-sm text-[#344054] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[38px]"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Company Name</label>
              <input
                name="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company Name"
                className="w-full border border-[#D0D5DD] bg-white rounded-md px-3 py-2.5 text-sm text-[#344054] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[38px]"
              />
            </div>

            {/* Display Name (with error) */}
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">
                Display Name
              </label>
              <input
                name="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Select or type to add"
                className="w-full border border-[#D0D5DD] bg-white rounded-md px-3 py-2.5 text-sm text-[#344054] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[38px]"
              />
            </div>

            {/* Lead Owner */}
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Lead Owner</label>
              <select
                onChange={(val) => handleSelectChange("leadOwner", val.target.value)}
                value={formData.leadOwner}
                className="w-full border border-[#D0D5DD] bg-white rounded-md px-3 py-2.5 text-sm text-[#667085] focus:outline-none focus:ring-2 focus:ring-blue-500 h-[38px]"
              >
                <option value="" disabled hidden>Lead Owner</option>
                {userNames.data.map((option: any) => (
                  <option key={option.value} value={option.label}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full border border-[#D0D5DD] bg-white rounded-md px-3 py-2.5 text-sm text-[#344054] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[38px]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, phone: numericValue });
                }}
                placeholder="Work Phone"
                className="w-full border border-[#D0D5DD] bg-white rounded-md px-3 py-2.5 text-sm text-[#344054] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[38px]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm text-[#344054] border border-[#D0D5DD] rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            {((!id && canCreate) || (id && canUpdate)) && (
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[#FF6B00] text-white rounded-md hover:bg-[#e65e00]"
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
