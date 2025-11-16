import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isAdmin = false }) => {
  const location = useLocation();

  const userLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'My Moodboards', path: '/my-moodboards', icon: '📋' },
    { name: 'Create New', path: '/create', icon: '➕' },
    { name: 'Community', path: '/community', icon: '👥' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Content', path: '/admin/content', icon: '📝' },
    { name: 'Reports', path: '/admin/reports', icon: '⚠️' },
    { name: 'Logs', path: '/admin/logs', icon: '📜' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {isAdmin ? 'Admin Panel' : 'Menu'}
        </h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                location.pathname === link.path
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
