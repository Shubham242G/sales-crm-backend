import React from "react";

const AddContact = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Add Customer</h1>
                <form>
                    {/* Contact Details Section */}
                    <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Contact Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Name
                            </label>
                            <input
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
                                type="text"
                                placeholder="Enter PAN number"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {/* Place of Supply */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Place of Supply
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-md p-2"
                                defaultValue=""
                            >
                                <option value="">Select place of supply</option>
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

export default AddContact;
