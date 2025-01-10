import { useState } from "react";


const AddTaskManagement = () => {

    const [department, setDepartment] = useState("");

    const [timeType, setTimeType] = useState(""); // Tracks whether "days" or "hours" is selected.
    const [options, setOptions] = useState<number[]>([]);  // Tracks the options to display.

    // Handle the change in the time type (Days/Hours).
    const handleTimeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const value: string = e.target.value; // Ensure `value` is typed as string.
        setTimeType(value); // Update state for time type.

        if (value === "days") {
            const days: number[] = Array.from({ length: 31 }, (_, i) => i + 1); // Generate array [1, 2, ..., 31].
            setOptions(days); // Update state with days options.
        } else if (value === "hours") {
            const hours: number[] = Array.from({ length: 24 }, (_, i) => i); // Generate array [0, 1, ..., 23].
            setOptions(hours); // Update state with hours options.
        } else {
            setOptions([]); // Clear options if no valid selection.
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Add New Task </h1>
                <form>
                    {/* Service Type and Event Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned To
                            </label>
                            <select className="input mb-6">
                                <option value="">Name of Employee</option>
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

                        {/* this field is auto populated from the Assigned to field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Department"
                                value={department}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type of Task
                            </label>
                            <select className="input mb-6">
                                <option value="">Type of Task</option>
                                {/* this field will be filled by given client */}
                                <option>Purpose of Visit</option>


                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Title
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Task Title"
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


                    {/* if this is not complete in this time then it has folloup reminder to complete the task */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task to be completed in
                            </label>
                            <select
                                className="input mb-3"
                                value={timeType}
                                onChange={handleTimeTypeChange}
                            >
                                <option value="">Select Type</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>

                            {timeType && (
                                <select className="input">
                                    <option value="">Select {timeType}</option>
                                    {options.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}


                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                            </label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div> */}

                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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

                    </div> */}

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
