import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/quizzes',   label: 'Quizzes',   icon: '📝' },
  { to: '/dsa',       label: 'DSA',       icon: '💻' },
  { to: '/notes',     label: 'Notes',     icon: '📒' },
  { to: '/interview', label: 'Interview', icon: '🎤' },
  { to: '/profile',   label: 'Profile',   icon: '👤' },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[.875rem] font-medium transition-all duration-200 ${
    isActive
      ? 'bg-white/15 text-white shadow-sm shadow-black/10'
      : 'text-blue-100 hover:bg-white/10 hover:text-white'
  }`;

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  return (
    <aside
      className={`
        fixed md:sticky top-0 left-0 z-40
        w-[260px] h-screen flex flex-col
        bg-gradient-to-b from-[#1e3a8a] to-[#1e40af]
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Brand */}
      <div className="px-6 pt-7 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg">
            🚀
          </div>
          <div>
            <h1 className="text-white font-extrabold text-[1.1rem] tracking-tight leading-tight">
              PrepDaily
            </h1>
            <p className="text-blue-200 text-[.7rem] font-medium mt-0.5">
              Interview Prep Hub
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin/quiz"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-base w-5 text-center">⚙️</span>
            Admin Quiz
          </NavLink>
        )}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin/dsa"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-base w-5 text-center">🔁</span>
            Admin DSA
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-sm font-bold text-white">
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-[.8125rem] font-semibold truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-blue-200 text-[.7rem] truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;