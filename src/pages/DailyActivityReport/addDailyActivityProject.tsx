import React, { useState } from "react";

const AddDailyActivityReport = () => {
  const [companyName, setCompanyName] = useState("");
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Report</h1>
        <form>
          {/* Service Type and Event Date */}
          {/* sales person data came from api */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sales person
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
                Date of Visit
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Event Details and Deadline */}

          {/* add the api to show the data from contact us */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Visited
              </label>
              <select className="input mb-6">
                <option value="">Customer Visited</option>
                <option>Anurag</option>
                <option>Vivek</option>
                <option>Bhawna</option>
                <option>Tushar</option>
              </select>
            </div>

            {/* this field will be auto filled from the contact us page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter event details"
                value={companyName}
              />
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode of Meeting
              </label>
              <select className="input mb-6">
                <option>Going to be personal</option>
                <option>ON Call</option>
                <option>Virtual Meeting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose of Visit
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter event details"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule your Followup Meeting
              </label>
              {/* <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter event details"
              /> */}
              <input type="datetime-local" id="datetime" name="datetime" className="w-full border border-gray-300 rounded-md p-2" placeholder="Schedule your Followup Meeting" />
            </div>
          </div>

          {/* Vendor List */}

          {/* Additional Instructions */}
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

export default AddDailyActivityReport;
