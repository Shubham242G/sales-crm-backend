import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { useDashboard } from '@/services/dashboard.service';
import { useUserById } from '@/services/user.service'; // Import the missing hook
import backgroundImage from "../../assets/background.jpg"
import { getAuth } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { Fullscreen } from 'lucide-react';

// User roles
type UserRole = 'sales' | 'operations' | 'admin';

// Chart types
type ChartType = 'Bar' | 'Line' | 'Pie';

// Data for each role
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

// Static fallback quotes (unchanged)
const staticQuotes = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Success is not final; failure is not fatal.", author: "Winston Churchill" },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  { text: "Believe you can and you’re halfway there.", author: "Theodore Roosevelt" },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln"
  },
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky"
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis"
  },
  {
    text: "Hardships often prepare ordinary people for an extraordinary destiny.",
    author: "C.S. Lewis"
  },
  {
    text: "Success is not how high you have climbed, but how you make a positive difference to the world.",
    author: "Roy T. Bennett"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    text: "Life is 10% what happens to us and 90% how we react to it.",
    author: "Charles R. Swindoll"
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne"
  },
  {
    text: "The biggest risk is not taking any risk.",
    author: "Mark Zuckerberg"
  },
  {
    text: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill"
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    author: "Thomas A. Edison"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "If you are not willing to risk the usual, you will have to settle for the ordinary.",
    author: "Jim Rohn"
  },
  {
    text: "The most difficult thing is the decision to act, the rest is merely tenacity.",
    author: "Amelia Earhart"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "If you cannot do great things, do small things in a great way.",
    author: "Napoleon Hill"
  },
  {
    text: "Dreams don't work unless you do.",
    author: "John C. Maxwell"
  },
  {
    text: "We can do anything we want to if we stick to it long enough.",
    author: "Helen Keller"
  },
  {
    text: "Self-discipline is the ability to make yourself do what you should do when you should do it, whether you feel like it or not.",
    author: "Elbert Hubbard"
  },
  {
    text: "Depending on what they are, our habits will either make us or break us. We become what we repeatedly do.",
    author: "Sean Covey"
  },
  {
    text: "We cannot become what we want by remaining what we are.",
    author: "Max DePree"
  },
  {
    text: "You will either step forward into growth, or you will step backward into safety.",
    author: "Abraham Maslow"
  },
  {
    text: "If there is no struggle, there is no progress.",
    author: "Frederick Douglass"
  },
  {
    text: "We are what we repeatedly do. Excellence is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.",
    author: "Vince Lombardi"
  },
  {
    text: "Success is not in what you have, but who you are.",
    author: "Bo Bennett"
  },
  {
    text: "The only place where success comes before work is in the dictionary.",
    author: "Vidal Sassoon"
  },
  {
    text: "You must expect great things of yourself before you can do them.",
    author: "Michael Jordan"
  },
  {
    text: "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.",
    author: "Jordan Belfort"
  },
  {
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller"
  },
  {
    text: "All our dreams can come true, if we have the courage to pursue them.",
    author: "Walt Disney"
  },
  {
    text: "Opportunities don't happen, you create them.",
    author: "Chris Grosser"
  },
];


// Colors for chart sections
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Field visibility settings
type FieldVisibility = {
  sales: { revenue: boolean; dealsClosed: boolean };
  operations: { operationalCost: boolean; efficiency: boolean };
  admin: { totalRevenue: boolean; expenses: boolean; profit: boolean };
};

const fetchDailyQuote = async () => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    return { text: data.content, author: data.author };
  } catch (error) {
    return staticQuotes[Math.floor(Math.random() * staticQuotes.length)];
  }
};

const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('sales');
  const [chartType, setChartType] = useState<ChartType>('Bar');
  const [visibleFields, setVisibleFields] = useState<FieldVisibility>({
    sales: { revenue: true, dealsClosed: true },
    operations: { operationalCost: true, efficiency: true },
    admin: { totalRevenue: true, expenses: true, profit: true },
  });
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [query, setQuery] = useState("");

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );
  // Fetch dashboard data using the useDashboard hook
  const { data: dashboardData, isLoading } = useDashboard(searchObj);


  // Extract costOfVendor, businessFromCustomer, and revenue from the fetched data
  const dashboard = dashboardData?.data?.[0] || {};
  const costOfVendor = dashboard.costOfVendor || '0';
  const businessFromCustomer = dashboard.businessFromCustomer || '0';
  const revenue = dashboard.revenue || '0';

  // Fetch quote on mount and update daily
  useEffect(() => {
    const updateQuote = async () => {
      const newQuote = await fetchDailyQuote();
      setQuote(newQuote);
    };

    updateQuote();

    const checkDailyUpdate = () => {
      const now = new Date();
      const lastFetchDate = localStorage.getItem('lastQuoteFetchDate');
      const today = now.toDateString();

      if (lastFetchDate !== today) {
        updateQuote();
        localStorage.setItem('lastQuoteFetchDate', today);
      }
    };

    const interval = setInterval(checkDailyUpdate, 60000);

    return () => clearInterval(interval);
  }, []);

  const getData = () => {
    if (userRole === 'sales') return salesData;
    if (userRole === 'operations') return operationsData;
    if (userRole === 'admin') return adminData;
    return [];
  };

  const data = getData();

  const toggleField = (role: UserRole, field: keyof FieldVisibility) => {
    setVisibleFields((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: !(prev[role] as Record<string, boolean>)[field],
      },
    }));
  };

  const getUserId = async () => {
    const decodedToken = await getAuth();
    if (decodedToken?.token) {
      setUserId(decodedToken.userId);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  const { data: UserDataById } = useUserById(userId ?? '');
  const navigate = useNavigate();

  const [isAuthorized, setIsAuthorized] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    setIsAuthorized(false);
    navigate("/");
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (UserDataById) {
      setFormData({
        name: UserDataById?.name || "",
        email: UserDataById?.email || "",
        role: UserDataById?.role || "",
      });
    }
  }, [UserDataById]);


  const renderChart = () => {
    const fields = visibleFields[userRole];

    if (chartType === 'Bar') {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis width={500} />
          <Tooltip />
          <Legend />
          {Object.entries(fields).map(([key, value]) =>
            value && <Bar key={key} dataKey={key} fill={COLORS[Object.keys(fields).indexOf(key)]} />
          )}
        </BarChart>
      );
    }

    if (chartType === 'Line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis width={500} />
          <Tooltip />
          <Legend />
          {userRole === 'sales' && (
            <>
              {(fields as { revenue: boolean; dealsClosed: boolean }).revenue && <Line type="monotone" dataKey="revenue" stroke="#8884d8" />}
              {(fields as { revenue: boolean; dealsClosed: boolean }).dealsClosed && <Line type="monotone" dataKey="dealsClosed" stroke="#82ca9d" />}
            </>
          )}
          {userRole === 'operations' && (
            <>
              {(fields as { operationalCost: boolean; efficiency: boolean }).operationalCost && <Line type="monotone" dataKey="operationalCost" stroke="#8884d8" />}
              {(fields as { operationalCost: boolean; efficiency: boolean }).efficiency && <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" />}
            </>
          )}
          {userRole === 'admin' && (
            <>
              {(fields as { totalRevenue: boolean; expenses: boolean; profit: boolean }).totalRevenue && <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />}
              {(fields as { totalRevenue: boolean; expenses: boolean; profit: boolean }).expenses && <Line type="monotone" dataKey="expenses" stroke="#ff7300" />}
              {(fields as { totalRevenue: boolean; expenses: boolean; profit: boolean }).profit && <Line type="monotone" dataKey="profit" stroke="#82ca9d" />}
            </>
          )}
        </LineChart>
      );
    }

    if (chartType === 'Pie') {
      if (userRole === 'admin') {
        return (
          <PieChart>
            <Pie data={pieData} cx="72%" cy="50%" outerRadius={110} fill="#8884d8" dataKey="value" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend  />
          </PieChart>
        );
      } else {
        return <p className="text-gray-500">Pie chart is only for Admin.</p>;
      }
    }

    return null;
  };


  return (
    <div className="min-h-screen  mx-auto 2xl:-ml-1 bg-gray-50 -mt-9 p-6">
      <div className=" w-[100%] 2xl:w-[100%] 2xl:ml-0 xl:ml-4 mx-auto">
        {/* Header */}
        <div className=" bg-white rounded-2xl text-3xl md:text-4xl font-extrabold text-gray-800 h-30 md:h-40   text-center shadow-lg py-4 px-6 mb-10 tracking-wide">
          <p className="text-gray-600 mt-10">Hello , {formData.name}</p>
        </div>

        {/* Financial Metrics Section */}
        {/* <div className="bg-white p-6 rounded-lg shadow-lg mb-6 "> */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Key Financial Metrics</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading financial data...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-2 bg-blue-50 rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
                <h3 className="bg-blue-50 rounded-xl p-4  text-lg font-medium text-blue-800">Cost of Vendors</h3>
                <p className="text-blue-500 text-2xl font-bold ml-4">₹{parseFloat(costOfVendor).toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
                <h3 className="bg-green-50 rounded-xl p-4  text-lg font-medium text-green-800">Business from Customers</h3>
                <p className="text-2xl font-bold ml-4 text-green-600">₹{parseFloat(businessFromCustomer).toLocaleString()}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
                <h3 className="bg-purple-50 rounded-xl p-4  text-lg font-medium text-purple-800">Revenue</h3>
                <p className="text-2xl font-bold ml-4 text-purple-600">₹{parseFloat(revenue).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Thought of the Day Section */}
        <div className="bg-gradient-to-r from-blue-100 mt-10 via-white to-pink-100 p-10 rounded-2xl shadow-md mb-10 text-center" >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 ">
            ✨Quote
          </h2>
          <div className="text-center flex flex-col justify-center items-center h-full px-10">
            {quote ? (
              <p className="text-2xl md:text-2xl font-semibold text-gray-800 mb-6">
                "{quote.text}" — <span className="font-semibold">{quote.author}</span>
              </p>
            ) : (
              <p className="text-lg text-gray-600">Loading Quotes...</p>
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
          <h2 className="text-xl font-semibold mb-4">{userRole.toUpperCase()} DASHBOARD</h2>

          {/* Pick a chart type */}
          <div className="flex gap-4 mb-4 items-center">
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
            {renderChart() ?? <p className="text-gray-500">No data available for the selected chart type.</p>}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;