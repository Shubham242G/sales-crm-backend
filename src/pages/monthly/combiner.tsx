import React, { useState, useMemo, useEffect } from 'react';

// Updated interface with time
interface ImonthlyPlanner {
    _id: string;
    date: string | Date;
    time?: string; // e.g., "14:30" (24-hour format)
    clientName: string;
    company: string;
    agenda: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

// Updated mock data with time
let mockData: ImonthlyPlanner[] = [
    { _id: '1', date: '2025-03-03', time: '09:00', clientName: 'John', company: 'Acme', agenda: 'Meeting', status: 'Pending' },
    { _id: '2', date: '2025-03-03', time: '14:30', clientName: 'Jane', company: 'XYZ', agenda: 'Review', status: 'Confirmed' },
    { _id: '3', date: '2025-03-04', time: '10:00', clientName: 'Bob', company: 'Corp', agenda: 'Call', status: 'Completed' },
];

// Hooks (updated for time)
const useMonthlyPlanner = (searchObj: { query?: string; pageIndex: number; pageSize: number }) => {
    const [data, setData] = useState<{ data: ImonthlyPlanner[] }>({ data: [] });

    useEffect(() => {
        const filtered = mockData.filter(m => {
            if (!searchObj.query) return true;
            const taskDate = new Date(m.date).toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD
            return taskDate === searchObj.query;
        });
        setData({ data: filtered });
    }, [searchObj.query]);

    return {
        data,
        refetch: () => setData({ data: mockData.filter(m => !searchObj.query || new Date(m.date).toLocaleDateString('en-CA') === searchObj.query) }),
    };
};

const useAddMonthlyPlanner = () => ({
    mutate: (payload: ImonthlyPlanner) => {
        mockData.push({ ...payload, _id: Date.now().toString() });
    },
});

const useUpdateMonthlyPlannerById = () => ({
    mutate: ({ id, obj }: { id: string; obj: ImonthlyPlanner }) => {
        mockData = mockData.map(m => (m._id === id ? { ...obj, _id: id } : m));
    },
});

const useDeleteMonthlyPlannerById = () => ({
    mutate: (params: { 0: string, 1?: { onSuccess?: () => void } }) => {
        const [id, options] = Array.isArray(params) ? params : [params];
        mockData = mockData.filter(m => m._id !== id);
        options?.onSuccess?.();
    },
});

// Main Component
const TaskManager: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<ImonthlyPlanner>>({
        date: new Date(),
        time: '09:00', // Default time
        clientName: '',
        company: '',
        agenda: '',
        status: 'Pending',
    });

    const { data: allPlanners, refetch: refetchAll } = useMonthlyPlanner({ query: '', pageIndex: 0, pageSize: 100 });
    const searchObj = useMemo(() => ({
        query: selectedDate || '',
        pageIndex: 0,
        pageSize: 10,
    }), [selectedDate]);
    const { data: monthlyPlanners, refetch } = useMonthlyPlanner(searchObj);

    const addMonthlyPlannerMutation = useAddMonthlyPlanner();
    const updateMonthlyPlannerMutation = useUpdateMonthlyPlannerById();
    const deleteMonthlyPlannerMutation = useDeleteMonthlyPlannerById();

    // Calendar Logic
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const colorScale = ['', 'bg-violet-500', 'bg-indigo-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500', 'bg-blue-500'];
    const dotColors = ['', 'bg-violet-500', 'bg-indigo-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500', 'bg-blue-500'];

    const getMeetingCount = (day: number): number => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-CA');
        return (allPlanners?.data || []).filter(m => new Date(m.date).toLocaleDateString('en-CA') === checkDate).length;
    };

    const getBackgroundColor = (day: number): string => {
        const count = getMeetingCount(day);
        return colorScale[Math.min(count, colorScale.length - 1)];
    };

    const getDotColor = (day: number): string => {
        const count = getMeetingCount(day);
        return dotColors[Math.min(count, dotColors.length - 1)];
    };

    const handleDateSelect = (date: Date) => {
        const dateStr = date.toLocaleDateString('en-CA'); // Consistent YYYY-MM-DD format
        setSelectedDate(dateStr);
        setFormData({ ...formData, date: dateStr });
        refetch();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const payload = {
            _id: '',
            ...formData,
            date: formData.date instanceof Date ? formData.date.toLocaleDateString('en-CA') : formData.date!,
            time: formData.time || '09:00', // Default time if not provided
            clientName: formData.clientName || '',
            company: formData.company || '',
            agenda: formData.agenda || '',
            status: formData.status || 'Pending',
        } as ImonthlyPlanner;

        if (editId) {
            updateMonthlyPlannerMutation.mutate({ id: editId, obj: payload });
            setOpen(false);
            setEditId(null);
        } else {
            addMonthlyPlannerMutation.mutate(payload);
            setOpen(false);
        }
        setFormData({ date: selectedDate!, time: '09:00', clientName: '', company: '', agenda: '', status: 'Pending' });
        refetch();
        refetchAll();
    };

    const handleEdit = (id: string, monthlyPlanner: ImonthlyPlanner) => {
        setEditId(id);
        setFormData({
            date: new Date(monthlyPlanner.date),
            time: monthlyPlanner.time || '09:00',
            clientName: monthlyPlanner.clientName,
            company: monthlyPlanner.company,
            agenda: monthlyPlanner.agenda,
            status: monthlyPlanner.status,
        });
        setOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteMonthlyPlannerMutation.mutate([id, { onSuccess: () => { refetch(); refetchAll(); } }]);
    };

    const handleOpenAdd = () => {
        setEditId(null);
        setFormData({ date: selectedDate || new Date().toLocaleDateString('en-CA'), time: '09:00', clientName: '', company: '', agenda: '', status: 'Pending' });
        setOpen(true);
    };

    return (
        <div className="min-h-screen p-6 mt-14">
            <h1 className="text-3xl font-bold text-center mb-6">Task Manager</h1>

            {/* Calendar */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mb-6">
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        className=" px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Previous
                    </button>
                    <h2 className="text-xl font-bold">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        className=" px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-bold text-gray-700">{day}</div>
                    ))}
                    {Array(firstDay).fill(null).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {days.map(day => (
                        <button
                            key={day}
                            className={`p-4 rounded-lg hover:bg-gray-200 ${getBackgroundColor(day)}`}
                            onClick={() => handleDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                        >
                            <div className="flex flex-col items-center">
                                {getMeetingCount(day) > 0 ? (
                                    <span >{day}</span>
                                ) : (
                                    <span>{day}</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Task List */}
            {selectedDate && (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Tasks for {new Date(selectedDate).toLocaleDateString()}</h2>
                    {monthlyPlanners?.data?.length > 0 ? (
                        monthlyPlanners.data.map((monthlyPlanner: ImonthlyPlanner) => (
                            <div key={monthlyPlanner._id} className="bg-white p-4 rounded-lg shadow mb-4">
                                {editId === monthlyPlanner._id ? (
                                    <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                                        <input
                                            type="text"
                                            value={formData.clientName}
                                            onChange={handleInputChange}
                                            name="clientName"
                                            className="w-full border p-2 rounded mb-2"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            name="company"
                                            className="w-full border p-2 rounded mb-2"
                                            required
                                        />
                                        <input
                                            type="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            name="time"
                                            className="w-full border p-2 rounded mb-2"
                                            required
                                        />
                                        <textarea
                                            value={formData.agenda}
                                            onChange={handleInputChange}
                                            name="agenda"
                                            className="w-full border p-2 rounded mb-2"
                                            required
                                        />
                                        <select
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            name="status"
                                            className="w-full border p-2 rounded mb-2"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <div className="flex gap-2">
                                            <button type="submit" className="bg-green-500 text-white  px-3 py-1.5 rounded">Save</button>
                                            <button
                                                type="button"
                                                onClick={() => setEditId(null)}
                                                className="bg-gray-500 text-white  px-3 py-1.5 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <h3 className="font-bold text-lg">{monthlyPlanner.clientName}</h3>
                                        <p>Company: {monthlyPlanner.company}</p>
                                        <p>Time: {monthlyPlanner.time || 'Not set'}</p>
                                        <p>Agenda: {monthlyPlanner.agenda}</p>
                                        <p>Status: {monthlyPlanner.status}</p>
                                        <p>Date: {new Date(monthlyPlanner.date).toLocaleDateString()}</p>
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                className="bg-blue-500 text-white  px-3 py-1.5 rounded"
                                                onClick={() => handleEdit(monthlyPlanner._id, monthlyPlanner)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white  px-3 py-1.5 rounded"
                                                onClick={() => handleDelete(monthlyPlanner._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No tasks for this date.</p>
                    )}
                    <button
                        onClick={handleOpenAdd}
                        className="mt-4 bg-blue-500 text-white  px-3 py-1.5 rounded hover:bg-blue-600"
                    >
                        Add Task
                    </button>
                </div>
            )}

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">{editId ? 'Edit Task' : 'Add Task'}</h3>
                        <div className="space-y-4">
                            <input
                                type="date"
                                name="date"
                                value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : formData.date}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                placeholder="Client Name"
                                className="w-full border p-2 rounded"
                            />
                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                placeholder="Company"
                                className="w-full border p-2 rounded"
                            />
                            <textarea
                                name="agenda"
                                value={formData.agenda}
                                onChange={handleInputChange}
                                placeholder="Agenda"
                                className="w-full border p-2 rounded"
                            />
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => setOpen(false)} className="bg-gray-500 text-white  px-3 py-1.5 rounded">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="bg-blue-500 text-white  px-3 py-1.5 rounded">
                                {editId ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;