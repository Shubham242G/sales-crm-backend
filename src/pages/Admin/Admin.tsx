import { useState } from 'react';

interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [message, setMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    try {
      const newUser = {
        ...formData,
        id: Date.now().toString()
      };

      setUsers([...users, newUser]);
      setMessage('User created successfully!');
      setFormData({ email: '', password: '', role: 'user' });
      
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      setMessage('Error creating user');
    }
  };

  return (
    <div className="container px-6">
      <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            User Management
          </h2>
        </div>

        <div className="create-user-form mb-8">
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full  px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Password:</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full  px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Role:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full  px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Sales</option>
                  <option value="editor">Operation</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#0B2F46] text-white font-semibold rounded-md hover:bg-[#0B2F46]/90 focus:outline-none focus:ring-2 focus:ring-[#0B2F46] text-sm"
              >
                Create User
              </button>
            </form>

            {message && (
              <div className="mt-4 text-center text-red-500 text-sm">
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="user-list">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Existing Users</h2>
          </div>
          
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;