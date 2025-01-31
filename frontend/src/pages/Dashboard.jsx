import { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  FiHome, FiBook, FiCalendar, FiMessageSquare,
  FiUsers, FiStar, FiChevronLeft, FiChevronRight,
  FiActivity, FiAward, FiClock, FiUser
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Chart.js Setup
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Theme Constants
const THEME = {
  text: {
    primary: '#f8fafc',    // slate-50
    secondary: '#e2e8f0',  // slate-200
    accent: '#818cf8'      // indigo-400
  },
  bg: {
    primary: '#0f172a',    // slate-900
    secondary: '#1e293b',  // slate-800
    accent: '#4f46e5'      // indigo-600
  }
};

const CHART_COLORS = {
  indigo: '#6366f1',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6'
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('weekly');

  // Navigation Items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
    { id: 'study-plan', label: 'Study Plan', icon: <FiBook /> },
    { id: 'collaborate', label: 'Collaborate', icon: <FiUsers /> },
    { id: 'resources', label: 'Resources', icon: <FiStar /> },
    { id: 'chat', label: 'AI Tutor', icon: <FiMessageSquare /> },
    { id: 'schedule', label: 'Schedule', icon: <FiCalendar /> }
  ];

  // Chart Data
  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Focus Time',
      data: [45, 60, 75, 50, 85, 40, 95],
      borderColor: CHART_COLORS.violet,
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      tension: 0.4,
      fill: true,
      borderWidth: 2
    }]
  };

  const progressData = {
    labels: ['Frontend', 'Backend', 'AI/ML', 'DevOps'],
    datasets: [{
      data: [35, 25, 20, 20],
      backgroundColor: Object.values(CHART_COLORS),
      borderWidth: 0
    }]
  };


  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: THEME.text.primary }
      },
      tooltip: {
        backgroundColor: THEME.bg.secondary,
        titleColor: THEME.text.primary,
        bodyColor: THEME.text.secondary
      }
    },
    scales: {
      x: {
        grid: { color: '#334155' },
        ticks: { color: THEME.text.secondary }
      },
      y: {
        grid: { color: '#334155' },
        ticks: { color: THEME.text.secondary }
      }
    }
  };

  return (
    <div className="flex min-h-screen font-mon" style={{ backgroundColor: THEME.bg.primary }}>
      {/* Sidebar */}
      <aside 
        className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        style={{ backgroundColor: THEME.bg.secondary }}
      >
        <div className="flex flex-col h-full p-4 border-r border-slate-700/50">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8 p-2">
            {isSidebarOpen ? (
              <span 
                className="text-xl font-bold"
                style={{ color: THEME.text.accent }}
              >
                ToolBox
              </span>
            ) : (
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: THEME.text.accent }} />
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-700/30 rounded-lg"
              style={{ color: THEME.text.primary }}
            >
              {isSidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeMenu === item.id ? 'bg-indigo-500/50 border-[1px] border-indigo-500' : 'hover:bg-slate-700/20'
                    }`}
                    style={{ color: THEME.text.primary }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isSidebarOpen && (
                      <span className="ml-3 text-sm">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: THEME.text.primary }}
            >
              {menuItems.find(m => m.id === activeMenu)?.label}
            </h1>
            <p className="text-sm" style={{ color: THEME.text.secondary }}>
              <FiClock className="inline mr-2" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p style={{ color: THEME.text.primary }}>Mridul Narula</p>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>
                Learning Level: Advanced
              </p>
            </div>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: THEME.bg.accent,
                color: THEME.text.primary
              }}
            >
              <FiUser />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Focus Time Card */}
              <div 
                className="p-6 rounded-xl border"
                style={{ 
                  backgroundColor: THEME.bg.secondary,
                  borderColor: '#334155'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-2" style={{ color: THEME.text.secondary }}>
                      Daily Focus
                    </p>
                    <p 
                      className="text-2xl font-bold mb-4"
                      style={{ color: THEME.text.primary }}
                    >
                      75/120 mins
                    </p>
                  </div>
                  <div className="relative w-16 h-16">
                    <Doughnut 
                      data={{
                        datasets: [{
                          data: [75, 45],
                          backgroundColor: [CHART_COLORS.violet, THEME.bg.secondary]
                        }]
                      }}
                      options={{ cutout: '70%' }}
                    />
                    <span 
                      className="-translate-y-9 text-xs font-medium flex items-center justify-center"
                      style={{ color: THEME.text.primary }}
                    >
                      62%
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm" style={{ color: THEME.text.secondary }}>
                  <FiActivity className="mr-2" />
                  <span>22% better than last week</span>
                </div>
              </div>

              {/* Progress Card */}
              <div 
                className="p-6 rounded-xl border"
                style={{ 
                  backgroundColor: THEME.bg.secondary,
                  borderColor: '#334155'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm" style={{ color: THEME.text.secondary }}>Weekly Goal</p>
                    <p 
                      className="text-2xl font-bold mt-1"
                      style={{ color: THEME.text.primary }}
                    >
                      8/10 hrs
                    </p>
                  </div>
                  <FiStar className="text-2xl" style={{ color: CHART_COLORS.amber }} />
                </div>
                <div className="w-full bg-slate-700/20 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: '80%',
                      backgroundColor: CHART_COLORS.amber
                    }}
                  />
                </div>
              </div>

              {/* Points Card */}
              <div 
                className="p-6 rounded-xl border"
                style={{ 
                  backgroundColor: THEME.bg.secondary,
                  borderColor: '#334155'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: THEME.text.secondary }}>Knowledge Points</p>
                    <p 
                      className="text-2xl font-bold mt-1"
                      style={{ color: THEME.text.primary }}
                    >
                      1,450 XP
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: THEME.text.secondary }}>Level 4</span>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: CHART_COLORS.emerald }}
                    >
                      <span style={{ color: THEME.text.primary }}>L4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Chart */}
            <div 
              className="p-6 rounded-xl border"
              style={{ 
                backgroundColor: THEME.bg.secondary,
                borderColor: '#334155'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 
                    className="text-lg font-semibold mb-2"
                    style={{ color: THEME.text.primary }}
                  >
                    Learning Engagement
                  </h2>
                  <p className="text-sm" style={{ color: THEME.text.secondary }}>
                    Focus time distribution across days
                  </p>
                </div>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: THEME.bg.primary,
                    color: THEME.text.primary,
                    borderColor: '#334155'
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="h-96">
                <Line data={engagementData} options={chartOptions} />
              </div>
            </div>

            {/* Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Knowledge Distribution */}
              <div 
                className="p-6 rounded-xl border"
                style={{ 
                  backgroundColor: THEME.bg.secondary,
                  borderColor: '#334155'
                }}
              >
                <h2 
                  className="text-lg font-semibold mb-6"
                  style={{ color: THEME.text.primary }}
                >
                  Knowledge Distribution
                </h2>
                <div className="h-64">
                  <Doughnut data={progressData} options={chartOptions} />
                </div>
              </div>

              {/* Recent Activities */}
              <div 
                className="p-6 rounded-xl border"
                style={{ 
                  backgroundColor: THEME.bg.secondary,
                  borderColor: '#334155'
                }}
              >
                <h2 
                  className="text-lg font-semibold mb-6"
                  style={{ color: THEME.text.primary }}
                >
                  Recent Achievements
                </h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div 
                      key={item}
                      className="p-4 rounded-lg flex items-center gap-4 transition-colors hover:bg-slate-700/20"
                    >
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: CHART_COLORS.indigo }}
                      >
                        <FiAward className="text-xl" style={{ color: THEME.text.primary }} />
                      </div>
                      <div>
                        <p style={{ color: THEME.text.primary }}>Completed React Course</p>
                        <p className="text-sm" style={{ color: THEME.text.secondary }}>
                          Earned 150 XP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;