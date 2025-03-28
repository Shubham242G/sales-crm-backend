
import React, { useState, useMemo, useEffect } from 'react';

// Mock service (unchanged)
interface ImonthlyPlanner {
    _id: string;
    date: string | Date;
    clientName: string;
    company: string;
    agenda: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

let mockData: ImonthlyPlanner[] = [
    { _id: '1', date: '2025-03-03T00:00:00.000Z', clientName: 'John', company: 'Acme', agenda: 'Meeting', status: 'Pending' },
    { _id: '2', date: '2025-03-03T00:00:00.000Z', clientName: 'Jane', company: 'XYZ', agenda: 'Review', status: 'Confirmed' },
    { _id: '3', date: '2025-03-04T00:00:00.000Z', clientName: 'Bob', company: 'Corp', agenda: 'Call', status: 'Completed' },
];

// Hooks (unchanged)
const useMonthlyPlanner = (searchObj: { query?: string; pageIndex: number; pageSize: number }) => {
    const [data, setData] = useState<{ data: ImonthlyPlanner[] }>({ data: [] });

    useEffect(() => {
        const filtered = mockData.filter(m => {
            if (!searchObj.query) return true;
            const taskDate = new Date(m.date).toISOString().split('T')[0];
            return taskDate === searchObj.query;
        });
        setData({ data: filtered });
    }, [searchObj.query]);

    return {
        data,
        refetch: () => setData({ data: mockData.filter(m => !searchObj.query || new Date(m.date).toISOString().split('T')[0] === searchObj.query) }),
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



    const colorScale = [
        '', 'bg-violet-500', 'bg-indigo-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500', 'bg-blue-500',
    ];
    const dotColors = [
        '', 'bg-violet-500', 'bg-indigo-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500', 'bg-blue-500',
    ];

    const getMeetingCount = (day: number): number => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        const count = (allPlanners?.data || []).filter(m => new Date(m.date).toISOString().split('T')[0] === checkDate).length;
        console.log(`Day ${day}: ${count} meetings on ${checkDate}`); // Debug log
        return count;
    };

    const getBackgroundColor = (day: number): string => {

        console.log(day, "check day")


        const count = getMeetingCount(day);

        console.log(count, "check count")
        return colorScale[Math.min(count, colorScale.length - 1)];
    };

    const getDotColor = (day: number): string => {
        const count = getMeetingCount(day);
        return dotColors[Math.min(count, dotColors.length - 1)];
    };

    // Ensure calendar updates when currentDate changes
    // useEffect(() => {
    //     refetchAll(); // Refetch all planners when the month changes
    // }, [currentDate, refetchAll]);

    const handleDateSelect = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        setFormData({ ...formData, date: new Date(dateStr) });
        refetch();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'date') {
            setFormData(prev => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        const payload = {
            _id: '',
            ...formData,
            date: formData.date instanceof Date ? formData.date.toISOString() : new Date(formData.date!).toISOString(),
            clientName: formData.clientName || '',
            company: formData.company || '',
            agenda: formData.agenda || '',
            status: formData.status || 'Pending'
        } as ImonthlyPlanner;

        if (editId) {
            updateMonthlyPlannerMutation.mutate({ id: editId, obj: payload as ImonthlyPlanner });
            setOpen(false);
            setEditId(null);
        } else {
            addMonthlyPlannerMutation.mutate(payload);
            setOpen(false);
        }
        setFormData({ date: new Date(selectedDate!), clientName: '', company: '', agenda: '', status: 'Pending' });
        refetch();
        refetchAll(); // Ensure calendar updates after adding/updating
    };

    const handleEdit = (id: string, monthlyPlanner: ImonthlyPlanner) => {
        setEditId(id);
        setFormData({
            date: new Date(monthlyPlanner.date),
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
        setFormData({ date: new Date(selectedDate!), clientName: '', company: '', agenda: '', status: 'Pending' });
        setOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Task Manager</h1>

            {/* Calendar */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mb-6">
                <div className="flex justify-between mb-4">

                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Previous
                    </button>
                    <h2 className="text-xl font-bold">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2 ">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className={`text-center font-bold text-gray-700 `}>{day}</div>
                    ))}
                    {Array(firstDay).fill(null).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {days.map(day => (<>

                        <button
                            key={day}
                            className={`p-4 rounded-lg hover:bg-gray-200 ${getBackgroundColor(day)}`}
                            onClick={() => handleDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                        >
                            <div className={`flex flex-col items-center  `}>
                                {getMeetingCount(day) > 0 ?  (
                                    <span className={`w-2 h-2 rounded-full mt-1  ${getDotColor(day)}`}>{day}</span>
                                ): (
                                    <span> {day} </span>
                                )}
                            </div>
                           
                        </button>
                    </>
                    ))}
                </div>
            </div>

            {/* Task List and Modal */}
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
                                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                                            <button
                                                type="button"
                                                onClick={() => setEditId(null)}
                                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <h3 className="font-bold text-lg">{monthlyPlanner.clientName}</h3>
                                        <p>Company: {monthlyPlanner.company}</p>
                                        <p>Agenda: {monthlyPlanner.agenda}</p>
                                        <p>Status: {monthlyPlanner.status}</p>
                                        <p>Date: {new Date(monthlyPlanner.date).toLocaleDateString()}</p>
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                                onClick={() => handleEdit(monthlyPlanner._id, monthlyPlanner)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
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
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                                value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : ''}
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
                            <button onClick={() => setOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
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