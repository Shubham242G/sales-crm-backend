import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { useDashboard } from '@/services/dashboard.service';
import { useUserById } from '@/services/user.service'; // Import the missing hook
import backgroundImage from "../../assets/background.jpg"
import { getAuth } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { Fullscreen, TrendingDown, TrendingUp, Users } from 'lucide-react';

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
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis width={500} stroke="#64748b" />
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
            <Legend />
          </PieChart>
        );
      } else {
        return <p className="text-gray-500">Pie chart is only for Admin.</p>;
      }
    }

    return null;
  };


  return (
    <div className=" mt-12  ">
      <div className=" w-[100%] 2xl:w-[100%] 2xl:ml-0 xl:ml-4 mx-auto">
        {/* Header */}
         <header className="bg-white border-b border-gray-100 px-6 py-8 sticky top-12 z-20 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-gray-800 mb-2">
            Hello, <span className="font-semibold text-gray-900">{formData.name}</span>
          </h1>
          <p className="text-gray-500 text-sm">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </header>

        {/* Financial Metrics Section */}
        {/* <div className="bg-white p-6 rounded-lg shadow-lg mb-6 "> */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Key Financial Metrics</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading financial data...</p>
          ) : (
            // <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            //   <div className="p-2 bg-blue-50 rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
            //     <h3 className="bg-blue-50 rounded-xl p-4  text-lg font-medium text-blue-800">Cost of Vendors</h3>
            //     <p className="text-blue-500 text-2xl font-bold ml-4">₹{parseFloat(costOfVendor).toLocaleString()}</p>
            //   </div>
            //   <div className="p-2 bg-green-50 rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
            //     <h3 className="bg-green-50 rounded-xl p-4  text-lg font-medium text-green-800">Business from Customers</h3>
            //     <p className="text-2xl font-bold ml-4 text-green-600">₹{parseFloat(businessFromCustomer).toLocaleString()}</p>
            //   </div>
            //   <div className="p-2 bg-purple-50 rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
            //     <h3 className="bg-purple-50 rounded-xl p-4  text-lg font-medium text-purple-800">Revenue</h3>
            //     <p className="text-2xl font-bold ml-4 text-purple-600">₹{parseFloat(revenue).toLocaleString()}</p>
            //   </div>
            // </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cost of Vendors */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium opacity-90">Cost of Vendors</h3>
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">₹{parseFloat(costOfVendor).toLocaleString()}</div>
              
            </div>
          </div>
          
          {/* Business from Customers */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium opacity-90">Business from Customers</h3>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">₹{parseFloat(businessFromCustomer).toLocaleString()}</div>
              
            </div>
          </div>
          
          {/* Revenue */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium opacity-90">Revenue</h3>
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">₹{parseFloat(revenue).toLocaleString()}</div>
              
            </div>
          </div>
        </div>
   
    
          )}
        </div>

        {/* Thought of the Day Section */}
        {/* <div className="bg-gradient-to-r from-blue-100 mt-5 via-white to-pink-100 p-10 rounded-2xl shadow-md mb-5 text-center" >
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
        </div> */}
         <div className="relative group mt-16 mb-14 ml-2 mr-6">
      {/* Background cards for stacking effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl transform rotate-2 opacity-75 group-hover:rotate-1 transition-transform duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl transform  opacity-75 group-hover:-rotate-1 transition-transform duration-300"></div>
      
      {/* Main card */}
      <div className="relative bg-white rounded-2xl p-8 shadow-xl transform group-hover:scale-105 transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-2xl opacity-20">💭</div>
        
        {/* Quote */}
        <blockquote className="text-xl text-gray-800 leading-relaxed mb-6 font-medium">
          {staticQuotes[Math.floor(Math.random() * staticQuotes.length)] ? `"${staticQuotes[Math.floor(Math.random() * staticQuotes.length)].text}"` : "Loading Quotes..."}
        </blockquote>
        
        {/* Author with avatar placeholder */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {staticQuotes[Math.floor(Math.random() * staticQuotes.length)]?.author?.split(' ').map(n => n[0]).join('')}
            </div> */}
            <span className="text-gray-700 font-medium">{ staticQuotes[Math.floor(Math.random() * staticQuotes.length)]?.author}</span>
          </div>
          <div className="text-2xl">📚</div>
        </div>
      </div>
    </div>

        {/* Buttons to switch roles */}
        <div className="flex justify-center gap-4 -ml-16 ">
          <button
            onClick={() => setUserRole('sales')}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-md font-medium shadow-lg" 
          >
            Sales
          </button>
          <button
            onClick={() => setUserRole('operations')}
            className="bg-blue-500 text-white  px-3 py-1.5 rounded-md font-medium shadow-lg" 
          >
            Operations
          </button>
          <button
            onClick={() => setUserRole('admin')}
           className="bg-blue-500 text-white px-3 py-1.5 rounded-md font-medium shadow-lg" 
          >
            Admin
          </button>
        </div>

        {/* Chart section */}
        <div className="bg-white p-6 rounded-lg shadow-lg ">
          <h2 className="text-lg font-semibold mb-4 text-center mt-2 -ml-16">{userRole.toUpperCase()} DASHBOARD</h2>

          {/* Pick a chart type */}
          <div className="flex gap-4 mb-4 items-center">
            <label className="font-semibold text-gray-900">Chart Type:</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm w-32"
            >
              <option value="Bar">Bar Chart</option>
              <option value="Line">Line Chart</option>
              {userRole === 'admin' && <option value="Pie">Pie Chart</option>}
            </select>
          </div>

          {/* Admin can choose what fields others see */}
          {userRole === 'admin' && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Show/Hide Fields</h3>
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
          <div className='ml-20'>
            <ResponsiveContainer width="90%" height={350} >
              {renderChart() ?? <p className="text-gray-500">No data available for the selected chart type.</p>}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;