import React, { useState } from 'react';
import { ImonthlyPlanner } from '../../services/monthlyPlanner.service';

interface MonthlyPlannerCardProps {
  monthlyPlanner: ImonthlyPlanner;
  onDelete: (id: string) => void;
  onUpdate: (id: string, monthlyPlanner: ImonthlyPlanner) => void;
}

const MonthlyPlannerCard: React.FC<MonthlyPlannerCardProps> = ({ monthlyPlanner, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<ImonthlyPlanner>>({
    clientName: monthlyPlanner.clientName,
    company: monthlyPlanner.company,
    agenda: monthlyPlanner.agenda,
    status: monthlyPlanner.status,
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(monthlyPlanner._id, { ...formData, date: monthlyPlanner.date } as ImonthlyPlanner);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div className="mb-2">
            <input
              type="text"
              value={formData.clientName}
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              value={formData.agenda}
              onChange={e => setFormData({ ...formData, agenda: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <select
              value={formData.status}
              onChange={e =>
                setFormData({ ...formData, status: e.target.value as ImonthlyPlanner['status'] })
              }
              className="w-full border p-2 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => onDelete(monthlyPlanner._id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyPlannerCard;