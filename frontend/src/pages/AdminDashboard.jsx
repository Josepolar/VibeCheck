import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AdminTable from '../components/AdminTable';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMoodboards: 0,
    totalPosts: 0,
    pendingReports: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.username}?`)) {
      try {
        await api.delete(`/admin/users/${user.user_id}`);
        fetchDashboardData();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const userColumns = [
    { key: 'user_id', label: 'ID' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { 
      key: 'created_at', 
      label: 'Joined',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (isActive) => (
        <span className={`px-2 py-1 rounded text-xs ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin={true} />
      
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{stats.totalUsers}</p>
          </div>
          <div className="card">
            <h3 className="text-gray-600 text-sm font-medium">Total Moodboards</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{stats.totalMoodboards}</p>
          </div>
          <div className="card">
            <h3 className="text-gray-600 text-sm font-medium">Total Posts</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{stats.totalPosts}</p>
          </div>
          <div className="card">
            <h3 className="text-gray-600 text-sm font-medium">Pending Reports</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.pendingReports}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <AdminTable
              data={users.slice(0, 10)}
              columns={userColumns}
              onDelete={handleDeleteUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
