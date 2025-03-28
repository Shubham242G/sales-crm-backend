import React, { useState } from 'react';
import { ImonthlyPlanner } from '../../services/monthlyPlanner.service';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  meetings: ImonthlyPlanner[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, meetings }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const hasMeeting = (day: number): boolean => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0]; // e.g., "2025-03-03"
    const result = meetings.some(meeting => {
      const meetingDate = new Date(meeting.date).toISOString().split('T')[0];
      return meetingDate === checkDate;
    });
    console.log(`Checking ${checkDate}: ${result}`); // Debug log
    return result;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
            className={`p-4 rounded-lg hover:bg-gray-100 ${hasMeeting(day) ? 'bg-blue-100' : ''}`}
            onClick={() => onDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          >
            <div className="flex flex-col items-center">
              {day}
              {hasMeeting(day) && (
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;