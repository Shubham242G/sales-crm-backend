import { useAddCustomer, useCustomerById, useUpdateCustomerById } from "@/services/customer.service";
import { toastError, toastSuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const AddCustomer = () => {


  const [formData, setFormData] = useState({




    contactName: "",
    contactOwner: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    panNumber: "",
    placeOfSupply: "",
    state: "",
    city: "",
    Area: "",
    Address: "",
    bankName: "",
    bankAccountNumber: "",
    bankIFSCCode: "",
    salutation: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhoneNumber: "",





  });


  const { id } = useParams();

  const navigate = useNavigate();
  const { mutateAsync: AddCustomer } = useAddCustomer();
  const { mutateAsync: updateCustomer } = useUpdateCustomerById();
  const { data: customerDataById, isLoading } = useCustomerById(id || "");


  useEffect(() => {
    // Prefill form when editing
    if (customerDataById) {
      console.log(customerDataById, "getById/");
      setFormData(customerDataById?.data || "");

    }
  }, [customerDataById]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const obj = formData;

      if (id) {

        const { data: res } = await updateCustomer({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/customer-sale")

        }
      } else {

        const { data: res } = await AddCustomer(obj);
        console.log(res, "res");
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/customer-sales")

        }
      }
    } catch (error) {
      toastError(error);
    }
  };









  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Customer</h1>
        <form onSubmit={handleSubmit}>
          {/* Contact Details Section */}
          <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input

                value={formData.contactName}
                name={"contactName"}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}

                type="text"
                placeholder="Enter contact name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Contact Owner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Owner
              </label>
              <input

                value={formData.contactOwner}
                name={"contactOwner"}
                onChange={(e) => setFormData({ ...formData, contactOwner: e.target.value })}
                type="text"
                placeholder="Auto fill"
                className="w-full border border-gray-300 rounded-md p-2"
                disabled
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input

                value={formData.companyName}
                name={"companyName"}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                type="text"
                placeholder="Enter company name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input

                value={formData.email}
                name={"email"}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                value={formData.phoneNumber}
                name={"phoneNumber"}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                type="text"
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* PAN Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </label>
              <input
                value={formData.panNumber}
                name={"panNumber"}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}

                type="text"
                placeholder="Enter PAN number"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Place of Supply */}
            {/* city or state or option are coming from api */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place of Supply
              </label>
              <select

                name={"placeOfSupply"}
                onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
                value={formData.placeOfSupply}
                className="w-full border border-gray-300 rounded-md p-2"
                defaultValue=""
              >
                <option value="">Select place of supply</option>
                <option value="Gujarat">Gujarat</option>
                {/* Add options as needed */}
              </select>
            </div>
          </div>

          {/* Billing Address Section */}
          <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input

                value={formData.state}
                name={"state"}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                type="text"
                placeholder="Enter state"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input

                value={formData.city}
                name={"city"}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}

                type="text"
                placeholder="Enter city"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <input

                value={formData.Area}
                name={"Area"}
                onChange={(e) => setFormData({ ...formData, Area: e.target.value })}
                type="text"
                placeholder="Enter area"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input

                value={formData.Address}

                name={"Address"}
                onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                type="text"
                placeholder="Enter address"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Bank Details Section */}
          <h2 className="text-lg font-semibold mb-4">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <input

                value={formData.bankName}
                name={"bankName"}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}

                type="text"
                placeholder="Enter bank name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Number
              </label>
              <input

                value={formData.bankAccountNumber}
                name={"bankAccountNumber"}
                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                type="text"
                placeholder="Enter account number"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code
              </label>
              <input

                value={formData.bankIFSCCode}
                name={"bankIFSCCode"}
                onChange={(e) => setFormData({ ...formData, bankIFSCCode: e.target.value })}
                type="text"
                placeholder="Enter IFSC code"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Contact Person Section */}
          <h2 className="text-lg font-semibold mb-4">Contact Person</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salutation
              </label>
              <select
                name="salutation"
                onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                value={formData.salutation}
                className="w-full border border-gray-300 rounded-md p-2"
                defaultValue=""
              >
                <option value="">Select salutation</option>
                <option>Mr.</option>
                <option>Ms.</option>
                <option>Dr.</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input

                name="contactPersonName"
                onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                value={formData.contactPersonName}
                type="text"
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input

                name="contactPersonEmail"
                onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                value={formData.contactPersonEmail}
                type="email"
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input

                name="contactPersonPhoneNumber"
                onChange={(e) => setFormData({ ...formData, contactPersonPhoneNumber: e.target.value })}
                value={formData.contactPersonPhoneNumber}
                type="text"
                placeholder="Enter phone number"
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

export default AddCustomer;
