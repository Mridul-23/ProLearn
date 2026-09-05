import { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import { FiHome, FiBook, FiMessageSquare, FiStar, FiChevronLeft, FiChevronRight, FiUser, FiClock, FiRotateCcw, FiCheck, FiX } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi";
import { useFocusTimer } from "../context/FocusTimerContext";

const MENU = [
  { path: "/user", label: "Dashboard", icon: <FiHome /> },
  { path: "/user/study-plan", label: "Study Plan", icon: <FiBook /> },
  { path: "/user/resources", label: "Resources", icon: <FiStar /> },
  { path: "/user/ai-tutor", label: "AI Tutor", icon: <FiMessageSquare /> },
  { path: "/user/audit", label: "Audit", icon: <HiShieldCheck /> },
  { path: "/user/profile", label: "User Profile", icon: <FiUser /> },
];

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const { duration, remaining, isRunning, start, pause, reset, finish, setDuration } = useFocusTimer();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;
  };

  const isExcludedRoute = location.pathname === "/user/ai-tutor" || location.pathname === "/user/resources";

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
    window.dispatchEvent(new CustomEvent("prolearn:mobile-menu", { detail: false }));
  };

  useEffect(() => {
    const handleMobileMenuState = (event) => {
      setMobileSidebarOpen(Boolean(event.detail));
    };

    window.addEventListener("prolearn:mobile-menu", handleMobileMenuState);

    return () => {
      window.removeEventListener("prolearn:mobile-menu", handleMobileMenuState);
    };
  }, []);

  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMobileSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex shrink-0 transition-all duration-300 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80 flex-col z-20 ${isOpen ? "w-64" : "w-20"}`}>
        <div className="flex flex-col h-full p-4">

          {/* Logo & Toggle Header */}
          <div className={`flex items-center mb-8 px-2 py-2 ${isOpen ? "justify-between" : "justify-center"}`}>
            {isOpen ? (
              <>
                <Link to="/" className="flex items-center gap-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                    ProLearn
                  </span>
                </Link>

                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors cursor-pointer" title="Collapse Sidebar">
                  <FiChevronLeft size={18} />
                </button>
              </>
            ) : (
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors cursor-pointer" title="Expand Sidebar">
                <FiChevronRight size={18} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5">
            {MENU.filter((item) => item.path !== "/user/profile").map((item) => (
              <NavLink key={item.path} to={item.path} end className={({ isActive }) => `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium transition-all duration-200 group ${isActive ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-500/10" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"}`}>
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="text-sm truncate tracking-tight">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <div className={`md:hidden fixed inset-0 z-[60] transition-[opacity,visibility] duration-300 ${mobileSidebarOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}`}>

        {/* Backdrop */}
        <button type="button" onClick={closeMobileSidebar} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" aria-label="Close navigation menu" />

        {/* Drawer */}
        <aside className={`relative w-[min(82vw,320px)] h-full bg-slate-900 border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-out ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col h-full p-4">

            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-8 px-2 py-2">
              <Link to="/" onClick={closeMobileSidebar} className="flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                  ProLearn
                </span>
              </Link>

              <button type="button" onClick={closeMobileSidebar} className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors" title="Close Navigation">
                <FiX size={18} />
              </button>
            </div>

            {/* Workspace Navigation */}
            <nav className="flex-1 space-y-1.5">
              {MENU.filter((item) => item.path !== "/user/profile").map((item) => (
                <NavLink key={item.path} to={item.path} end onClick={closeMobileSidebar} className={({ isActive }) => `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-500/10" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"}`}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="text-sm truncate tracking-tight">{item.label}</span>
                </NavLink>
              ))}

              <div className="my-3 border-t border-slate-800/80" />

              <NavLink to="/guidelines" onClick={closeMobileSidebar} className={({ isActive }) => `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-500/10" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"}`}>
                <FiBook className="text-xl flex-shrink-0" />
                <span className="text-sm tracking-tight">Guidelines</span>
              </NavLink>

              <NavLink to="/user/profile" onClick={closeMobileSidebar} className={({ isActive }) => `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-500/10" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"}`}>
                <FiUser className="text-xl flex-shrink-0" />
                <span className="text-sm tracking-tight">User Profile</span>
              </NavLink>
            </nav>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        <main className="flex-1 overflow-x-hidden bg-slate-950">

          {/* Focus Timer */}
          <div className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-3">

              {/* Focus + Timer */}
              <div className="flex items-center gap-2.5 shrink-0">
                <FiClock className="text-indigo-400" />
                <span className="text-sm font-semibold text-slate-300 hidden xs:inline">Focus</span>
                <span className="font-mono text-sm text-white">{formatTime(remaining)}</span>
              </div>

              {/* Desktop Duration Options */}
              <div className="hidden sm:flex items-center gap-1.5">
                {[5, 10, 15, 30, 60].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setDuration(minutes * 60)}
                    disabled={isRunning}
                    className={`shrink-0 px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${duration === minutes * 60 ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"}`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>

              {/* Mobile Duration Select */}
              <select
                value={duration / 60}
                onChange={(event) => setDuration(Number(event.target.value) * 60)}
                disabled={isRunning}
                aria-label="Focus duration"
                className="sm:hidden w-16 rounded-md bg-slate-900 border border-slate-800 px-1.5 py-1 text-[11px] font-medium text-slate-300 focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {[5, 10, 15, 30, 60].map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes}m
                  </option>
                ))}
              </select>

              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
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
                    <span className="hidden sm:inline">Finish</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={`${!isExcludedRoute ? "p-4 sm:p-6 lg:p-8" : ""}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;