import React, { useState } from 'react';

interface Meeting {
  date: Date;
  clientName: string;
  company: string;
  agenda: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

interface MeetingFormProps {
  selectedDate: Date | null;
  onSubmit: (meeting: Meeting) => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ selectedDate, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Meeting>>({
    clientName: '',
    company: '',
    agenda: '',
    status: 'Pending'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      onSubmit({ ...formData, date: selectedDate } as Meeting);
      setFormData({ clientName: '', company: '', agenda: '', status: 'Pending' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">New Meeting - {selectedDate?.toLocaleDateString()}</h2>
      <div className="mb-4">
        <label className="block mb-1">Client Name</label>
        <input
          type="text"
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Company</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Agenda</label>
        <textarea
          value={formData.agenda}
          onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Meeting['status'] })}
          className="w-full border p-2 rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Meeting
      </button>
    </form>
  );
};

export default MeetingForm;