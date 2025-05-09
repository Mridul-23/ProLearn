import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, FiBook, FiMessageSquare,
  FiStar, FiChevronLeft, FiChevronRight,
  FiClock, FiUser
} from 'react-icons/fi';

const MENU = [
  { path: '/user', label: 'Dashboard', icon: <FiHome /> },
  { path: '/user/study-plan',label: 'Study Plan', icon: <FiBook /> },
  { path: '/user/resources', label: 'Resources', icon: <FiStar /> },
  { path: '/user/ai-tutor',   label: 'AI Tutor',  icon: <FiMessageSquare /> }
];

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen font-mon" style={{ backgroundColor: '#0f172a' }}>
      {/* Sidebar */}
      <aside className={`transition-all ${isOpen ? 'w-52' : 'w-20'}`} style={{ backgroundColor: '#1e293b' }}>
        <div className="flex flex-col h-full p-4 border-r border-slate-700/50">
          <div className="flex items-center justify-between mb-8 p-2">
            {isOpen ? (
              <span className="text-xl font-bold" style={{ color: '#818cf8' }}>
                ToolBox
              </span>
            ) : (
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#818cf8' }} />
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-slate-700/30 rounded-lg"
              style={{ color: '#f8fafc' }}
            >
              {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {MENU.map(item => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end
                    className={({ isActive }) => 
                      `w-full flex items-center p-3 rounded-lg transition-colors ${
                        isActive ? 'bg-indigo-500/50 border-[1px] border-indigo-500' : 'hover:bg-slate-700/20'
                      }`
                    }
                    style={{ color: '#f8fafc' }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isOpen && <span className="ml-3 text-sm">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#f8fafc' }}>
              {MENU.find(m => m.path === location.pathname)?.label}
            </h1>
            <p className="text-sm flex items-center" style={{ color: '#e2e8f0' }}>
              <FiClock className="inline mr-2" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p style={{ color: '#f8fafc' }}>Mridul Narula</p>
              <p className="text-sm" style={{ color: '#e2e8f0' }}>Learning Level: Advanced</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4f46e5', color: '#f8fafc' }}>
              <FiUser />
            </div>
          </div>
        </div>

        {/* Content Outlet */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;