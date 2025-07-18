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

  // const salutationOptions = [
  //   { value: "Mr", label: "Mr" },
  //   { value: "Ms", label: "Ms" },
  //   { value: "Mrs", label: "Mrs" },
  //   { value: "Dr", label: "Dr" },
  // ];



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
    //         <div className="flex">
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             Salutation
    //           </label>
    //           <select
    //             onChange={(val) =>
    //               handleSelectChange("salutation", val.target.value)
    //             }
    //             value={formData.salutation}
    //             className="border  border-gray-300 bg-gray-50 rounded-md p-2 md:p-4 w-[35%] text-gray-500 placeholder-gray-400"
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
    //         <div className="flex">
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
    //             className="w-[35%] bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Display Name */}
    //         <div className="flex">
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
    //             className="w-[35%] bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Lead Owner */}
    //         <div className="flex">
    //           <label className="block text-sm font-semibold text-gray-700 mb-2">
    //             Lead Owner
    //           </label>
    //           <select
    //             onChange={(val) =>
    //               handleSelectChange("leadOwner", val.target.value)
    //             }
    //             value={formData.leadOwner}
    //             className="border  border-gray-300 bg-gray-50 rounded-md p-2 md:p-4 w-[35%] text-gray-500 placeholder-gray-400"
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
    //         <div className="flex">
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
    //             className="w-[35%] bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Company Name */}
    //         <div className="flex">
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
    //             className="w-[35%] bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Email Address */}
    //         <div className="flex">
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
    //             className="w-[35%] bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
    //           />
    //         </div>

    //         {/* Mobile Number */}
    //         <div className="flex">
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
    //             className="w-[35%] bg-gray-50 border border-gray-300 rounded-md p-2 md:p-4 placeholder-gray-400"
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
    //             className=" px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600"
    //           >
    //             Save
    //           </button>
    //         )}
    //       </div>
    //     </form>
    //   </div>
    // </div>

    <div className=" h-[90vh] p-6 mt-24">
     <div className="max-w-4xl -mt-10 bg-white shadow-lg  rounded-lg p-4">
  <h1 className="text-lg font-semibold mb-6 mt-2 text-[#101828] ">Add New Lead</h1>
  <form onSubmit={handleSubmit}>
    {/* Primary Contact */}
     <div className="mb-6 ">
      <div className="flex items-center gap-10 mb-4">
     <label className=" text-sm font-medium text-[#344054] mb-2 flex items-center gap-1">
        Primary Contact
       
      </label>

      <div className="flex gap-4">
        {/* Salutation */}
        <select
          onChange={(val) => handleSelectChange("salutation", val.target.value)}
          value={formData.salutation}
          className={`w-[90px] border border-[#D0D5DD] bg-white rounded-md px-2 pt-1 text-sm placeholder:text-sm focus:outline-none text-[#344054] focus:ring-2 focus:ring-blue-400 h-[30px]`}
        >
          <option value="" disabled hidden className="text-sm text-gray-400">Salutation</option>
          <option value="Mr." className="text-xs text-[#344054]">Mr.</option>
          <option value="Ms." className="text-xs text-[#344054]">Ms.</option>
          <option value="Mrs." className="text-xs text-[#344054]">Mrs.</option>
            <option value="Dr." className="text-xs text-[#344054]">Dr.</option>
         
        </select>
        

        {/* First Name */}
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value.toUpperCase() })}
          placeholder="First Name"
          className="flex-1 border border-[#D0D5DD] bg-white rounded-md p-1 px-2 text-xs text-[#344054] placeholder-gray-400 placeholder:text-sm focus:outline-none  h-[30x]"
        />

        {/* Last Name */}
        <input
          name="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value.toUpperCase() })}
          placeholder="Last Name"
          className="flex-1 border border-[#D0D5DD] bg-white rounded-md px-2 text-xs text-[#344054] placeholder-gray-400 placeholder:text-sm focus:outline-none  h-[30px]"
        />
      </div>
        </div>
         <div className="grid grid-cols-1 gap-y-1 ">
            {/* Company Name */}
            <div className="flex mb-4 ">
              <label className="text-sm font-medium text-[#344054] ">Company Name</label>
              <input
                name="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company:  e.target.value.toUpperCase() })}
                placeholder="Company Name"
                className="w-[35%] border border-[#D0D5DD] bg-white rounded-md px-2 text-xs text-[#344054] placeholder-gray-400 focus:outline-none  h-[30px] ml-10"
              />
            </div>

            {/* Display Name (with error) */}
            <div className="flex mb-4">
              <label className="block text-sm font-medium text-[#344054] mb-1">
                Display Name
              </label>
              <input
                name="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName:  e.target.value.toUpperCase() })}
                placeholder="Select or type to add"
                className="w-[35%] border border-[#D0D5DD] bg-white rounded-md px-2 text-xs text-[#344054] placeholder-gray-400 focus:outline-none  h-[30px] ml-14"
              />
            </div>

            {/* Lead Owner */}
            <div className="flex mb-4">
              <label className="block text-sm font-medium text-[#344054] mb-1">Assign To</label>
              <select
                onChange={(val) => handleSelectChange("leadOwner", val.target.value)}
                value={formData.leadOwner}
                className="w-[35%] border border-[#D0D5DD] bg-white rounded-md px-2  pt-1 text-sm text-[#30353f] focus:outline-none  h-[30px] ml-20"
              >
                <option value="" disabled hidden>Select</option>
                {userNames.data.map((option: any) => (
                  <option key={option.value} value={option.label}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div className="flex mb-4">
              <label className="block text-sm font-medium text-[#344054] mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email:  e.target.value.toLowerCase() })}
                placeholder="Email Address"
                className="w-[35%] border border-[#D0D5DD] bg-white rounded-md px-2 text-xs text-[#344054] placeholder-gray-400 focus:outline-none  h-[30px] ml-[6%]"
              />
            </div>

            {/* Phone */}
            <div className="flex mb-4">
              <label className="block text-sm font-medium text-[#344054] mb-1">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, phone: numericValue });
                }}
                placeholder="Work Phone"
                className="w-[35%] border border-[#D0D5DD] bg-white rounded-md px-2 text-xs text-[#344054] placeholder-gray-400 focus:outline-none  h-[30px] ml-[11.5%]"
              />
            </div>
          </div>
</div>
          {/* Buttons */}
          
        <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-1 text-xs text-[#344054] border border-[#D0D5DD] rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            {((!id && canCreate) || (id && canUpdate)) && (
              <button
                type="submit"
                className="px-4 py-1 text-xs bg-[#FF6B00] text-white rounded-md hover:bg-[#e65e00]"
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
