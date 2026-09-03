import { useState } from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import { FiHome, FiBook, FiMessageSquare, FiStar, FiChevronLeft, FiChevronRight, FiUser, FiClock, FiRotateCcw, FiCheck } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi"
import { useFocusTimer } from "../context/FocusTimerContext";

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
  const { duration, remaining, isRunning, start, pause, reset, finish, setDuration } = useFocusTimer();
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;
  };

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
        <main className="flex-1 overflow-x-hidden bg-slate-950">
          <div className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FiClock className="text-indigo-400" />
                <span className="text-sm font-semibold text-slate-300">Focus</span>
                <span className="font-mono text-sm text-white">
                  {formatTime(remaining)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[5, 10, 15, 30, 60].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setDuration(minutes * 60)}
                    disabled={isRunning}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                      duration === minutes * 60
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={isRunning ? pause : start}
                  disabled={remaining === 0}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isRunning ? "Pause" : "Start"}
                </button>

                <button
                  onClick={reset}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Reset timer"
                >
                  <FiRotateCcw size={15} />
                </button>

                {remaining < duration && (
                  <button
                    onClick={finish}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <FiCheck />
                    Finish
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={`${!isExcludedRoute ? "p-8" : ""}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;