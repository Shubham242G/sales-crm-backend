import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';



// User roles (simple string options)
type UserRole = 'sales' | 'operations' | 'admin';

// Chart types (simple options)
type ChartType = 'Bar' | 'Line' | 'Pie';

// Data for each role (simple objects)
const salesData = [
  { month: 'Jan', revenue: 4000, dealsClosed: 20 },
  { month: 'Feb', revenue: 3000, dealsClosed: 15 },
  { month: 'Mar', revenue: 5000, dealsClosed: 25 },
];

const operationsData = [
  { month: 'Jan', operationalCost: 2000, efficiency: 85 },
  { month: 'Feb', operationalCost: 2500, efficiency: 90 },
  { month: 'Mar', operationalCost: 2300, efficiency: 88 },
];

const adminData = [
  { month: 'Jan', totalRevenue: 10000, expenses: 6000, profit: 4000 },
  { month: 'Feb', totalRevenue: 12000, expenses: 7000, profit: 5000 },
  { month: 'Mar', totalRevenue: 15000, expenses: 8000, profit: 7000 },
];

const pieData = [
  { name: 'Sales', value: 4000 },
  { name: 'Operations', value: 3000 },
  { name: 'Other', value: 2000 },
];


const quotes = [
  ...[
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Success is not final; failure is not fatal.", author: "Winston Churchill" },
    { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
    { text: "Believe you can and you’re halfway there.", author: "Theodore Roosevelt" },
    { text: "The only limit is your mind.", author: "Unknown" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "Dream big, work hard, stay focused.", author: "Unknown" },
    { text: "Every day is a fresh start.", author: "Unknown" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "Keep going; you’re closer than you think.", author: "Unknown" },
    { text: "Turn obstacles into opportunities.", author: "Unknown" },
    { text: "Stay positive, work hard, make it happen.", author: "Unknown" },
    { text: "Success is the sum of small efforts.", author: "Robert Collier" },
    { text: "Focus on the goal, not the struggle.", author: "Unknown" },
    { text: "What you do today shapes tomorrow.", author: "Unknown" },
    { text: "Courage is taking the first step.", author: "Unknown" },
    { text: "Progress, not perfection.", author: "Unknown" },
    { text: "You are enough.", author: "Unknown" },
    { text: "Make it happen; shock everyone.", author: "Unknown" },
    { text: "Sell the problem you solve, not the product.", author: "Unknown" },
    { text: "Every sale starts with a conversation.", author: "Unknown" },
    { text: "The best salespeople listen more than they talk.", author: "Unknown" },
    { text: "A sale is made in every call; either you sell or they sell you ‘no’.", author: "Unknown" },
    { text: "Persistence beats resistance.", author: "Unknown" },
    { text: "Know your customer, win the deal.", author: "Unknown" },
    { text: "Sales is about trust, not tricks.", author: "Unknown" },
    { text: "Close the deal, open the relationship.", author: "Unknown" },
    { text: "Every ‘no’ brings you closer to ‘yes’.", author: "Unknown" },
    { text: "Sell value, not price.", author: "Unknown" },
    { text: "Success in sales is a numbers game.", author: "Unknown" },
    { text: "The harder you work, the luckier you get in sales.", author: "Unknown" },
    { text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
    { text: "Winning starts with preparation.", author: "Unknown" },
    { text: "Sales is helping, not selling.", author: "Unknown" },
    { text: "Ask questions, find solutions.", author: "Unknown" },
    { text: "Your attitude determines your altitude in sales.", author: "Unknown" },
    { text: "Build relationships, not just deals.", author: "Unknown" },
    { text: "Success is the best revenge.", author: "Frank Sinatra" },
    { text: "Keep knocking until the door opens.", author: "Unknown" },
    { text: "Efficiency is doing things right.", author: "Peter Drucker" },
    { text: "Simplify, then amplify.", author: "Unknown" },
    { text: "Good processes save time.", author: "Unknown" },
    { text: "Teamwork makes the dream work.", author: "John C. Maxwell" },
    { text: "Measure twice, cut once.", author: "Unknown" },
    { text: "Details matter in operations.", author: "Unknown" },
    { text: "Work smarter, not harder.", author: "Unknown" },
    { text: "Consistency is key.", author: "Unknown" },
    { text: "Great systems build great results.", author: "Unknown" },
    { text: "Plan the work, work the plan.", author: "Unknown" },
    { text: "Efficiency turns chaos into order.", author: "Unknown" },
    { text: "Every step counts in the process.", author: "Unknown" },
    { text: "Precision drives progress.", author: "Unknown" },
    { text: "Organize today for success tomorrow.", author: "Unknown" },
    { text: "The best operations run like clockwork.", author: "Unknown" },
    { text: "Small improvements, big wins.", author: "Unknown" },
    { text: "Focus on what works, fix what doesn’t.", author: "Unknown" },
    { text: "Strong teams build strong outcomes.", author: "Unknown" },
    { text: "Time is money; save both.", author: "Unknown" },
    { text: "Excellence is a habit.", author: "Aristotle" },
    { text: "Leadership is action, not position.", author: "Donald H. McGannon" },
    { text: "Control the chaos, create the calm.", author: "Unknown" },
    { text: "A good admin sees the big picture.", author: "Unknown" },
    { text: "Empower others to succeed.", author: "Unknown" },
    { text: "Organize, prioritize, succeed.", author: "Unknown" },
    { text: "The best leaders lift others up.", author: "Unknown" },
    { text: "Vision without execution is just a dream.", author: "Unknown" },
    { text: "Lead by example, not by force.", author: "Unknown" },
    { text: "Clarity is power.", author: "Unknown" },
    { text: "A team is only as strong as its leader.", author: "Unknown" },
    { text: "Plan today, win tomorrow.", author: "Unknown" },
    { text: "Great admin builds great teams.", author: "Unknown" },
    { text: "Decide, delegate, deliver.", author: "Unknown" },
    { text: "Success starts with structure.", author: "Unknown" },
    { text: "Be the calm in the storm.", author: "Unknown" },
    { text: "Lead with purpose, not pressure.", author: "Unknown" },
    { text: "Every detail builds the whole.", author: "Unknown" },
    { text: "Inspire, don’t just manage.", author: "Unknown" },
    { text: "A leader’s job is to create more leaders.", author: "Unknown" },
    { text: "Set the tone, shape the future.", author: "Unknown" },
    { text: "Don’t wait for opportunity; create it.", author: "Unknown" },
    { text: "Hard work beats talent when talent doesn’t work.", author: "Tim Notke" },
    { text: "The only way to do great work is to love it.", author: "Steve Jobs" },
    { text: "Start where you stand.", author: "Unknown" },
    { text: "Fear is a liar; action is truth.", author: "Unknown" },
    { text: "You don’t find time; you make it.", author: "Unknown" },
    { text: "Rise above the storm and find the sun.", author: "Unknown" },
    { text: "Effort today, rewards tomorrow.", author: "Unknown" },
    { text: "Be the change you wish to see.", author: "Mahatma Gandhi" },
    { text: "One small step can change everything.", author: "Unknown" },
    { text: "Doubt kills more dreams than failure.", author: "Suzy Kassem" },
    { text: "Keep pushing; the best is yet to come.", author: "Unknown" },
    { text: "Your only competition is yesterday’s you.", author: "Unknown" },
    { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
    { text: "The future belongs to those who believe.", author: "Eleanor Roosevelt" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "You are stronger than you know.", author: "Pankaj Maurya" },
    { text: "Make today count.", author: "vinay yadav" },
    { text: "Impossible is just an opinion.", author: "Paulo Coelho" },
    { text: "Shine bright; the world needs your light.", author: "Unknown" },
  ]
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Which fields to show for each role (simple true/false settings)
type FieldVisibility = {
  sales: { revenue: boolean; dealsClosed: boolean };
  operations: { operationalCost: boolean; efficiency: boolean };
  admin: { totalRevenue: boolean; expenses: boolean; profit: boolean };
};

// Fetch a random quote from the API
// const fetchQuote = async () => {
//   const response = await axios.get('https://zenquotes.io/api/today');
//   return response.data[0]; // { q: "quote", a: "author" }
// };

const Dashboard: React.FC = () => {
  // State for current user role, chart type, and field visibility
  const [userRole, setUserRole] = useState<UserRole>('sales');
  const [chartType, setChartType] = useState<ChartType>('Bar');
  const [visibleFields, setVisibleFields] = useState<FieldVisibility>({
    sales: { revenue: true, dealsClosed: true },
    operations: { operationalCost: true, efficiency: true },
    admin: { totalRevenue: true, expenses: true, profit: true },
  });

  // Get a new quote every minute using TanStack Query
  // const { data: quote, isLoading: quoteLoading } = useQuery({
  //   queryKey: ['quote'],
  //   queryFn: fetchQuote,
  //   refetchInterval: 60000, // Refresh every 60 seconds
  // });


 

  // Pick the right data based on the user role
  const getData = () => {
    if (userRole === 'sales') return salesData;
    if (userRole === 'operations') return operationsData;
    if (userRole === 'admin') return adminData;
    return [];
  };

  const data = getData();

  // Toggle whether a field is shown (used by Admin)
  const toggleField = (role: UserRole, field: keyof FieldVisibility): void => {
    if (!visibleFields.hasOwnProperty(role)) {
      throw new Error(`Unknown role: ${role}`);
    }
    const prevFields = visibleFields[role];
    if (!prevFields.hasOwnProperty(field)) {
      throw new Error(`Unknown field: ${field}`);
    }

    setVisibleFields((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: !(prev[role] as Record<string, boolean>)[field],
      },
    }))
    // setVisibleFields((prev) => ({
    //   ...prev,
    //   [role]: {
    //     ...prev[role],
    //     [field]: !prev[role][field], // Flip true/false
    //   },
    // }));
  };

  // Draw the chart based on the selected type and role
  const renderChart = () => {
    const fields = visibleFields[userRole]; // Get visible fields for the current role

    if (chartType === 'Bar') {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.entries(fields).map(([key, value]) => (
            value && <Bar key={key} dataKey={key} fill={COLORS[Object.keys(fields).indexOf(key)]} />
          ))}
        </BarChart>
      );
    }

    if (chartType === 'Line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {userRole === 'sales' && (
  <>
    {(fields as { revenue: boolean; dealsClosed: boolean; }).revenue && <Line type="monotone" dataKey="revenue" stroke="#8884d8" />}
    {(fields as { revenue: boolean; dealsClosed: boolean; }).dealsClosed && <Line type="monotone" dataKey="dealsClosed" stroke="#82ca9d" />}
  </>
)}
          {userRole === 'operations' && (
            <>
              {(fields as { operationalCost: boolean; efficiency: boolean; }).operationalCost && <Line type="monotone" dataKey="operationalCost" stroke="#8884d8" />}
              {(fields as { operationalCost: boolean; efficiency: boolean; }).efficiency && <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" />}
            </>
          )}
          {userRole === 'admin' && (
            <>
              {(fields as { totalRevenue: boolean; expenses: boolean; profit: boolean; }).totalRevenue && <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />}
              {(fields as { totalRevenue: boolean; expenses: boolean; profit: boolean; }).expenses && <Line type="monotone" dataKey="expenses" stroke="#ff7300" />}
              {(fields as { totalRevenue: boolean; expenses: boolean; profit: boolean; }).profit && <Line type="monotone" dataKey="profit" stroke="#82ca9d" />}
            </>
          )}
        </LineChart>
      );
    }

    if (chartType === 'Pie') {
      if (userRole === 'admin') {
        return (
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      } else {
        return <p className="text-gray-500">Pie chart is only for Admin.</p>;
      }
    }

    return null;
  };
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with a quote */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Financial Dashboard</h1>
          <div className="mt-4 text-center">
            { (
              <p className="text-lg text-gray-600 italic ">
                "{quote?.text}" — <span className="font-semibold">{quote?.author}</span>
              </p>
            )}
          </div>
        </div>

        {/* Buttons to switch roles */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setUserRole('sales')}
            className={`px-4 py-2 rounded-lg ${userRole === 'sales' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Sales
          </button>
          <button
            onClick={() => setUserRole('operations')}
            className={`px-4 py-2 rounded-lg ${userRole === 'operations' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Operations
          </button>
          <button
            onClick={() => setUserRole('admin')}
            className={`px-4 py-2 rounded-lg ${userRole === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Admin
          </button>
        </div>

        {/* Chart section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">{userRole.toUpperCase()} Dashboard</h2>

          {/* Pick a chart type */}
          <div className="flex gap-4 mb-4">
            <label className="font-medium">Chart Type:</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="border p-2 rounded-lg"
            >
              <option value="Bar">Bar Chart</option>
              <option value="Line">Line Chart</option>
              {userRole === 'admin' && <option value="Pie">Pie Chart</option>}
            </select>
          </div>

          {/* Admin can choose what fields others see */}
          {userRole === 'admin' && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Show/Hide Fields</h3>
              {Object.entries(visibleFields).map(([role, fields]) => (
                <div key={role} className="mb-4">
                  <h4 className="font-medium capitalize">{role} Fields:</h4>
                  <div className="flex gap-4">
                    {Object.entries(fields).map(([field, visible]) => (
                      <label key={field} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={() => toggleField(role as UserRole, field as keyof FieldVisibility)}
                          className="h-4 w-4"
                        />
                        <span>{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show the chart */}
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()?? <p className="text-gray-500">No data available for the selected chart type.</p>}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;