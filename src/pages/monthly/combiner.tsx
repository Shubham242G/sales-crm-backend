import { useAddmonthlyPlanner, usedeletemonthlyPlannerById, usemonthlyPlanner, useUpdatemonthlyPlannerById } from '@/services/monthlyPlanner.service';
import { toastError, toastSuccess } from '@/utils/toast';
import React, { useState, useMemo, useEffect } from 'react';

// Updated interface with time and remark
interface ImonthlyPlanner {
    _id: string;
    date: string | Date;
    time?: string;
    clientName: string;
    company: string;
    agenda: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | string;
    remark: string;
    isRemark: boolean;
}

// Mock data for demonstration
let monthlyPlannerData: ImonthlyPlanner[] = [
    {
        _id: '1',
        date: '2025-05-30',
        time: '10:00',
        clientName: 'John Doe',
        company: 'ABC Corp',
        agenda: 'Project discussion',
        status: 'Pending',
        remark: '',
        isRemark: false
    },
    {
        _id: '2',
        date: '2025-05-30',
        time: '14:30',
        clientName: 'Jane Smith',
        company: 'XYZ Ltd',
        agenda: 'Budget review',
        status: 'Confirmed',
        remark: '',
        isRemark: false
    }
];

// Mock toast functions
// const toastSuccess = (message: string) => {
//     console.log('Success:', message);
//     alert('Success: ' + message);
// };

// const toastError = (error: any) => {
//     console.error('Error:', error);
//     alert('Error: ' + (error?.message || error));
// };

// Custom hooks
// const useMonthlyPlanner = (searchObj: { query?: string; pageIndex: number; pageSize: number }) => {
//     const [data, setData] = useState<{ data: ImonthlyPlanner[] }>({ data: [] });

//     useEffect(() => {
//         const filtered = monthlyPlannerData.filter(m => {
//             if (!searchObj.query) return true;
//             const taskDate = new Date(m.date).toLocaleDateString('en-CA');
//             return taskDate === searchObj.query;
//         });
//         setData({ data: filtered });
//     }, [searchObj.query, monthlyPlannerData]);

//     return {
//         data,
//         refetch: () => {
//             const filtered = monthlyPlannerData.filter(m => {
//                 if (!searchObj.query) return true;
//                 const taskDate = new Date(m.date).toLocaleDateString('en-CA');
//                 return taskDate === searchObj.query;
//             });
//             setData({ data: filtered });
//         },
//     };
// };

// const useAddMonthlyPlanner = () => ({
//     mutateAsync: async (payload: Omit<ImonthlyPlanner, '_id'>) => {
//         const newPlanner = { ...payload, _id: Date.now().toString() };
//         monthlyPlannerData.push(newPlanner);
//         return { data: { message: 'Task added successfully!' } };
//     },
// });

// const useUpdateMonthlyPlannerById = () => ({
//     mutateAsync: async ({ id, obj }: { id: string; obj: Partial<ImonthlyPlanner> }) => {
//         monthlyPlannerData = monthlyPlannerData.map(m => 
//             m._id === id ? { ...m, ...obj, _id: id } : m
//         );
//         return { data: { message: 'Task updated successfully!' } };
//     },
// });

// const useDeleteMonthlyPlannerById = () => ({
//     mutateAsync: async ({ id, remark }: { id: string; remark: string }) => {
//         // Update the item with remark before "deleting" (or mark as deleted)
//         monthlyPlannerData = monthlyPlannerData.map(m => 
//             m._id === id ? { ...m, remark, isRemark: true, status: 'Cancelled' } : m
//         );
        
//         // If you want to actually remove it, uncomment the line below:
//         // monthlyPlannerData = monthlyPlannerData.filter(m => m._id !== id);
        
//         return { data: { message: 'Task cancelled with remark!' } };
//     },
// });

// Main Component
const TaskManager: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteRemark, setDeleteRemark] = useState('');
    
    const [formData, setFormData] = useState<Partial<ImonthlyPlanner>>({
        date: new Date(),
        time: '09:00',
        clientName: '',
        company: '',
        agenda: '',
        status: 'Pending',
        remark: '',
        isRemark: false,
    });

    const { data: allPlanners, refetch: refetchAll } = usemonthlyPlanner({ 
        query: '', 
        pageIndex: 0, 
        pageSize: 100 
    });

    const [allPlannersData, setAllPlanners] = useState<ImonthlyPlanner[]>([]);  


    useEffect(() => {
        if (allPlanners) {
            setAllPlanners(allPlanners.data);
        }
    }, [allPlanners]);


    
    
    const searchObj = useMemo(() => ({
        query: selectedDate || '',
        pageIndex: 0,
        pageSize: 10,
    }), [selectedDate]);
    
    const { data: monthlyPlanners, refetch } = usemonthlyPlanner(searchObj);

    const { mutateAsync: addMonthlyPlanner } = useAddmonthlyPlanner();
    const { mutateAsync: updateMonthlyPlanner } = useUpdatemonthlyPlannerById();
    const { mutateAsync: deleteMonthlyPlanner } = usedeletemonthlyPlannerById();

    // Calendar Logic
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const colorScale = ['', 'bg-violet-200', 'bg-indigo-200', 'bg-orange-200', 'bg-green-200', 'bg-red-200', 'bg-blue-200'];

    const getMeetingCount = (day: number): number => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-CA');
        return (allPlanners?.data || []).filter((m:any)=> new Date(m.date).toLocaleDateString('en-CA') === checkDate).length;
    };

    const getBackgroundColor = (day: number): string => {
        const count = getMeetingCount(day);
        return colorScale[Math.min(count, colorScale.length - 1)];
    };

    const handleDateSelect = (date: Date) => {
        const dateStr = date.toLocaleDateString('en-CA');
        setSelectedDate(dateStr);
        setFormData({ ...formData, date: dateStr });
        refetch();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {

        console.log("working")
        try {
            const payload = {
                ...formData,
                date: formData.date instanceof Date ? formData.date.toLocaleDateString('en-CA') : formData.date!,
                time: formData.time || '09:00',
                clientName: formData.clientName || '',
                company: formData.company || '',
                agenda: formData.agenda || '',
                status: formData.status || 'Pending',
                remark: formData.remark || '',
                isRemark: formData.isRemark || false,
            } as Omit<ImonthlyPlanner, '_id'>;

            if (editId) {
                const { data: res } = await updateMonthlyPlanner({ id: editId, obj: payload });
                if (res) {
                    toastSuccess(res.message);
                }
                setEditId(null);
            } else {
                const { data: res } = await addMonthlyPlanner(payload);
                if (res) {
                    toastSuccess(res.message);
                }
            }
            
            setOpen(false);
            setFormData({ 
                date: selectedDate!, 
                time: '09:00', 
                clientName: '', 
                company: '', 
                agenda: '', 
                status: 'Pending',
                remark: '',
                isRemark: false
            });
            refetch();
            refetchAll();
        } catch (error) {
            toastError(error);
        }
    };


    const handleEdit = (id: string, monthlyPlanner: ImonthlyPlanner) => {
        setEditId(id);
        setFormData({
            date: monthlyPlanner.date,
            time: monthlyPlanner.time || '09:00',
            clientName: monthlyPlanner.clientName,
            company: monthlyPlanner.company,
            agenda: monthlyPlanner.agenda,
            status: monthlyPlanner.status,
            remark: monthlyPlanner.remark,
            isRemark: monthlyPlanner.isRemark,
        });
        setOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setDeleteRemark('');
        setDeleteModalOpen(true);
    };

    const handleDeleteSubmit = async () => {
        if (!deleteId || !deleteRemark.trim()) {
            toastError('Please enter a remark for cancellation');
            return;
        }

        try {
            const { data: res } = await updateMonthlyPlanner({ 
                id: deleteId, 
              obj: { remark: deleteRemark, isRemark: true }
            });
            
            if (res) {
                toastSuccess(res.message);
            }
            
            setDeleteModalOpen(false);
            setDeleteId(null);
            setDeleteRemark('');
            refetch();
            refetchAll();
        } catch (error) {
            toastError(error);
        }
    };

    const handleOpenAdd = () => {
        setEditId(null);
        setFormData({ 
            date: selectedDate || new Date().toLocaleDateString('en-CA'), 
            time: '09:00', 
            clientName: '', 
            company: '', 
            agenda: '', 
            status: 'Pending',
            remark: '',
            isRemark: false
        });
        setOpen(true);
    };

    return (
        <div className="h-[98vh] bg-gray-100 p-6 mt-14 overflow-scroll">
            <h1 className="text-3xl font-bold text-center mb-6">Task Manager</h1>

            {/* Calendar */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mb-6">
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Previous
                    </button>
                    <h2 className="text-xl font-bold">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-bold text-gray-700 p-2">{day}</div>
                    ))}
                    {Array(firstDay).fill(null).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {days.map(day => (
                        <button
                            key={day}
                            className={`p-4 rounded-lg hover:bg-gray-300 transition-colors ${getBackgroundColor(day)}`}
                            onClick={() => handleDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium">{day}</span>
                                {getMeetingCount(day) > 0 && (
                                    <span className="text-xs bg-blue-500 text-white rounded-full px-1 mt-1">
                                        {getMeetingCount(day)}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Task List */}
            {selectedDate && (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">
                        Tasks for {new Date(selectedDate).toLocaleDateString()}
                    </h2>
                    {allPlannersData?.length > 0 ? (
                        allPlannersData.map((planner: ImonthlyPlanner) => (
                            <div key={planner._id} className="bg-gray-50 p-4 rounded-lg shadow mb-4 border">
                                <h3 className="font-bold text-lg text-blue-600">{planner.clientName}</h3>
                                <p className="text-gray-700"><strong>Company:</strong> {planner.company}</p>
                                <p className="text-gray-700"><strong>Time:</strong> {planner.time || 'Not set'}</p>
                                <p className="text-gray-700"><strong>Agenda:</strong> {planner.agenda}</p>
                                <p className="text-gray-700">
                                    <strong>Status:</strong> 
                                    {planner.remark ? <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                       
                                       
                                        planner.status === 'Cancelled' ? 'bg-red-200 text-red-800' :
                                        'bg-yellow-200 text-yellow-800'
                                    }`}>
                                   Cancelled
                                    </span>: <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                        planner.status === 'Completed' ? 'bg-green-200 text-green-800' :
                                        planner.status === 'Confirmed' ? 'bg-blue-200 text-blue-800' :
                                        planner.status === 'Cancelled' ? 'bg-red-200 text-red-800' :
                                        'bg-yellow-200 text-yellow-800'
                                    }`}>
                                       { planner.status}
                                    </span>}
                                </p>
                                {planner.isRemark && planner.remark && (
                                    <p className="text-gray-700 mt-2">
                                        <strong>Remark:</strong> 
                                        <span className="bg-yellow-100 px-2 py-1 rounded ml-2">{planner.remark}</span>
                                    </p>
                                )}
                                <div className="mt-3 flex gap-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors"
                                        onClick={() => handleEdit(planner._id, planner)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors"
                                        onClick={() => handleDeleteClick(planner._id)}
                                    >
                                        Cancel Task
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No tasks for this date.</p>
                    )}
                    <button
                        onClick={handleOpenAdd}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                        Add New Task
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{editId ? 'Edit Task' : 'Add New Task'}</h3>
                        <div className="space-y-4">
                            <input
                                type="date"
                                name="date"
                                value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : formData.date}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                placeholder="Client Name"
                                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                placeholder="Company"
                                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <textarea
                                name="agenda"
                                value={formData.agenda}
                                onChange={handleInputChange}
                                placeholder="Agenda"
                                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                required
                            />
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <button 
                                onClick={() => setOpen(false)} 
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                {editId ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete/Cancel Modal with Remark */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4 text-red-600">Cancel Task</h3>
                        <p className="text-gray-700 mb-4">
                            Please provide a reason for cancelling this task:
                        </p>
                        <textarea
                            value={deleteRemark}
                            onChange={(e) => setDeleteRemark(e.target.value)}
                            placeholder="Enter cancellation reason..."
                            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            rows={4}
                            required
                        />
                        <div className="mt-6 flex gap-2">
                            <button 
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setDeleteId(null);
                                    setDeleteRemark('');
                                }} 
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteSubmit} 
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                disabled={!deleteRemark.trim()}
                            >
                                Cancel Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;