import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default calendar styles
import { FaEdit, FaTrash } from "react-icons/fa"; // Icons from react-icons

interface IMeeting {
    id: string;
    date: Date;
    clientName: string;
    company: string;
    agenda: string;
    status: string;
}

const MeetingCalendar: React.FC = () => {
    // State for the calendar and meetings
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [meetings, setMeetings] = useState<IMeeting[]>([
        // Sample data
        {
            id: "1",
            date: new Date("2025-03-27"),
            clientName: "John Doe",
            company: "xAI",
            agenda: "Discuss AI",
            status: "Scheduled",
        },
        {
            id: "2",
            date: new Date("2025-03-27"),
            clientName: "Jane Smith",
            company: "Tech Corp",
            agenda: "Project Review",
            status: "Completed",
        },
        {
            id: "3",
            date: new Date("2025-03-28"),
            clientName: "Alice Brown",
            company: "Innovate Inc",
            agenda: "Strategy Meeting",
            status: "Scheduled",
        },
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<IMeeting>>({
        date: selectedDate || new Date(),
        clientName: "",
        company: "",
        agenda: "",
        status: "",
    });

    // Get meetings for a specific date
    const getMeetingsForDate = (date: Date) => {
        return meetings.filter(
            (meeting) =>
                new Date(meeting.date).toDateString() === date.toDateString()
        );
    };

    // Color-code dates based on the number of meetings
    const tileClassName = ({ date }: { date: Date }) => {
        const meetingCount = getMeetingsForDate(date).length;
        if (meetingCount === 0) return "bg-white";
        if (meetingCount === 1) return "bg-blue-100";
        if (meetingCount === 2) return "bg-blue-300";
        return "bg-blue-500 text-white"; // 3 or more meetings
    };

    // Handle date click
    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setFormData((prev) => ({ ...prev, date }));
    };

    // Handle form input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission (add or edit meeting)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMeeting: IMeeting = {
            id: editId || Date.now().toString(), // Generate ID for new meeting
            date: new Date(formData.date!),
            clientName: formData.clientName || "",
            company: formData.company || "",
            agenda: formData.agenda || "",
            status: formData.status || "",
        };

        if (editId) {
            // Update existing meeting
            setMeetings((prev) =>
                prev.map((meeting) =>
                    meeting.id === editId ? newMeeting : meeting
                )
            );
        } else {
            // Add new meeting
            setMeetings((prev) => [...prev, newMeeting]);
        }

        // Reset form and close dialog
        setFormData({
            date: selectedDate || new Date(),
            clientName: "",
            company: "",
            agenda: "",
            status: "",
        });
        setEditId(null);
        setOpenDialog(false);
    };

    // Handle edit meeting
    const handleEdit = (meeting: IMeeting) => {
        setEditId(meeting.id);
        setFormData({
            date: meeting.date,
            clientName: meeting.clientName,
            company: meeting.company,
            agenda: meeting.agenda,
            status: meeting.status,
        });
        setOpenDialog(true);
    };

    // Handle delete meeting
    const handleDelete = (id: string) => {
        setMeetings((prev) => prev.filter((meeting) => meeting.id !== id));
    };

    // Handle add meeting
    const handleOpenAdd = () => {
        setEditId(null);
        setFormData({
            date: selectedDate || new Date(),
            clientName: "",
            company: "",
            agenda: "",
            status: "",
        });
        setOpenDialog(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Meeting Calendar
            </h1>

            {/* Calendar and Meetings Section */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Calendar */}
                <div className="md:w-1/2">
                    <Calendar
                        onClickDay={handleDateClick}
                        tileClassName={tileClassName}
                        className="border rounded-lg shadow-md w-full"
                    />
                </div>

                {/* Meetings for Selected Date */}
                {selectedDate && (
                    <div className="md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">
                            Meetings on {selectedDate.toDateString()}
                        </h2>
                        <button
                            onClick={handleOpenAdd}
                            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add Meeting
                        </button>
                        <div className="space-y-4">
                            {getMeetingsForDate(selectedDate).length === 0 ? (
                                <p className="text-gray-500">
                                    No meetings scheduled for this day.
                                </p>
                            ) : (
                                getMeetingsForDate(selectedDate).map(
                                    (meeting) => (
                                        <div
                                            key={meeting.id}
                                            className="p-4 border rounded-lg shadow-sm bg-white"
                                        >
                                            <h3 className="text-lg font-medium">
                                                {meeting.clientName}
                                            </h3>
                                            <p>
                                                <strong>Company:</strong>{" "}
                                                {meeting.company}
                                            </p>
                                            <p>
                                                <strong>Agenda:</strong>{" "}
                                                {meeting.agenda}
                                            </p>
                                            <p>
                                                <strong>Status:</strong>{" "}
                                                {meeting.status}
                                            </p>
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(meeting)
                                                    }
                                                    className="p-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <FaEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(meeting.id)
                                                    }
                                                    className="p-2 text-red-600 hover:text-red-800"
                                                >
                                                    <FaTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Meeting Dialog */}
            <dialog
                open={openDialog}
                className="p-6 rounded-lg shadow-lg bg-white max-w-md w-full"
            >
                <h2 className="text-xl font-semibold mb-4">
                    {editId ? "Edit Meeting" : "Add Meeting"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="date"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={
                                formData.date instanceof Date
                                    ? formData.date.toISOString().split("T")[0]
                                    : ""
                            }
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="clientName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Client Name
                        </label>
                        <input
                            type="text"
                            id="clientName"
                            name="clientName"
                            value={formData.clientName || ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="company"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Company
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company || ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="agenda"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Agenda
                        </label>
                        <input
                            type="text"
                            id="agenda"
                            name="agenda"
                            value={formData.agenda || ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setOpenDialog(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {editId ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default MeetingCalendar;