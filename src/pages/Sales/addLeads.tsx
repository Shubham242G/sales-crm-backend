import React from "react";

const AddNewLead = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Lead</h1>
        <form>
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Contact Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                defaultValue=""
              >
                <option value="">Select contact type</option>
                <option>None</option>
                <option>Client contact</option>
                <option>Vendor contact</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
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
                type="text"
                placeholder="Enter company name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* PAN Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </label>
              <input
                type="text"
                placeholder="Enter PAN number"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Number
              </label>
              <input
                type="text"
                placeholder="Enter GST number"
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
