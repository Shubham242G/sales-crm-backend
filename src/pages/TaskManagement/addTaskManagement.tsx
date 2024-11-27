import React, { useState } from "react";

const AddTaskManagement = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Add Report</h1>
                <form>
                    {/* Service Type and Event Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned To
                            </label>
                            <select className="input mb-6">
                                <option value="">Sales person</option>
                                <option>Anurag</option>
                                <option>Vivek</option>
                                <option>Bhawna</option> 
                                <option>Tushar</option>
                            </select>
                            {/* <input
                placeholder="Contact Person"
                type="date"
                className="input"
              /> */}
                            {/* <select
                className="w-full border border-gray-300 rounded-md p-2"
                multiple
              >
                <option>Hotel</option>
                <option>Banquet</option>
                <option>Event</option>
                <option>Transport</option>
              </select> */}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Title
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter event details"
                            />
                        </div>


                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="Enter additional instructions"
                            rows={4}
                        ></textarea>
                    </div>
                    {/* Event Details and Deadline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                            </label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                            </label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                    </div>

                    {/* Vendor List */}

                    {/* Additional Instructions */}
                                

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
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskManagement;
