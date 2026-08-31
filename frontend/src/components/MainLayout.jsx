import { useState } from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiMessageSquare,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi"

const MENU = [
  { path: "/user", label: "Dashboard", icon: <FiHome /> },
  { path: "/user/study-plan", label: "Study Plan", icon: <FiBook /> },
  { path: "/user/resources", label: "Resources", icon: <FiStar /> },
  { path: "/user/ai-tutor", label: "AI Tutor", icon: <FiMessageSquare /> },
  { path: "/user/audit", label: "Audit", icon: <HiShieldCheck />},
  { path: "/user/profile", label: "User Profile", icon: <FiUser /> },
];

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isExcludedRoute = location.pathname === "/user/ai-tutor" || location.pathname === "/user/resources";

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80 flex flex-col z-20 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo & Toggle Header */}
          <div
            className={`flex items-center mb-8 px-2 py-2 ${isOpen ? "justify-between" : "justify-center"}`}
          >
            {isOpen ? (
              <>
                <Link to="/" className="flex items-center gap-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                    ProLearn
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors cursor-pointer"
                  title="Collapse Sidebar"
                >
                  <FiChevronLeft size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors cursor-pointer"
                title="Expand Sidebar"
              >
                <FiChevronRight size={18} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5">
            {MENU.filter((item) => item.path !== "/user/profile").map(
              (item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-500/10"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                    }`
                  }
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {isOpen && (
                    <span className="text-sm truncate tracking-tight">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ),
            )}
          </nav>

          {/* Sidebar Footer Badge */}
          {isOpen && (
            <div className="pt-4 border-t border-slate-800/80 mt-auto">
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400">
                <span className="font-medium text-slate-300 block">
                  Pro Workspace
                </span>
                <span className="text-[10px] text-indigo-400 font-medium">
                  AI Engine Active
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main
          className={`flex-1 overflow-x-hidden bg-slate-950 ${
            !isExcludedRoute ? "p-8" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;