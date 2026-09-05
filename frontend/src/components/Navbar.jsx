import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LuBookOpenCheck, LuHouse, LuLogIn, LuUser, LuUserPlus, LuLayoutDashboard } from 'react-icons/lu';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './component.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isWorkspace = location.pathname.startsWith('/user');
  const showWorkspaceNavigation = Boolean(user) && isWorkspace;

  useEffect(() => {
    const handleMobileMenu = (event) => {
      setMobileMenuOpen(event.detail);
    };

    window.addEventListener("prolearn:mobile-menu", handleMobileMenu);

    return () => {
      window.removeEventListener("prolearn:mobile-menu", handleMobileMenu);
    };
  }, []);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const handleMobileWorkspaceMenu = () => {
    const nextState = !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    window.dispatchEvent(new CustomEvent('prolearn:mobile-menu', { detail: nextState }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('prolearn:mobile-menu', { detail: false }));
  };

  const name = user?.display_name || user?.username || 'Learner';
  const initial = name.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 font-poppins">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu} className="flex flex-col justify-center items-start group">
            <div>
              <span className="uppercase text-2xl logo-gradient font-bold font-sans tracking-tight">
                ProLearn
              </span>
              <div className="select-none uppercase tracking-widest text-[0.55rem] -mt-1 font-normal text-slate-400">
                <span className="font-bold text-indigo-400">Pro</span>
                fessional
                <span className="font-bold text-indigo-400"> Learn</span>
                ing
              </div>
            </div>
          </Link>

          {/* ================= LOGGED IN ================= */}
          {user ? (
            <>
              {/* Desktop Authenticated Navigation */}
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/guidelines" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-indigo-400 hover:bg-slate-900 transition-all">
                  <LuBookOpenCheck className="text-base" />
                  <span>Guidelines</span>
                </Link>

                <Link to="/user/profile" className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-200">{name}</p>
                    <p className="text-xs text-slate-400">@{user.username}</p>
                  </div>

                  <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold shadow-inner">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{initial}</span>
                    )}
                  </div>
                </Link>

                <button onClick={handleLogout} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 transition-all text-sm font-medium" title="Logout">
                  <FiLogOut className="text-base" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Mobile Authenticated Navigation */}
              <div className="flex sm:hidden items-center">
                <button onClick={showWorkspaceNavigation ? handleMobileWorkspaceMenu : () => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 transition-all" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen}>
                  {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ================= LOGGED OUT ================= */}
              <div className="hidden sm:flex items-center gap-4">
                <Link to="/features" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-indigo-400 hover:bg-slate-900 transition-all">
                  Features
                </Link>

                <Link to="/guidelines" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-indigo-400 hover:bg-slate-900 transition-all">
                  <LuBookOpenCheck className="text-base" />
                  Guidelines
                </Link>

                <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-indigo-400 hover:bg-slate-900 transition-all">
                  <LuLogIn className="text-base" />
                  Login
                </Link>

                <Link to="/signup" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20">
                  <LuUserPlus className="text-base" />
                  Sign Up
                </Link>
              </div>

              {/* Mobile Logged Out Navigation */}
              <div className="flex sm:hidden items-center">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 transition-all" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen}>
                  {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= PUBLIC MOBILE MENU ================= */}
      <div className={`sm:hidden absolute left-0 right-0 top-full overflow-hidden bg-slate-950 border-b border-slate-800 font-poppins transition-all duration-300 ease-out ${mobileMenuOpen && !showWorkspaceNavigation ? "max-h-[500px] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 border-b-0 pointer-events-none"}`}>
        <div className="px-4 pt-3 pb-5 space-y-1">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-all">
            <LuHouse className="text-lg" />
            <span>Home</span>
          </Link>

          <Link to="/features" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-all">
            <LuLayoutDashboard className="text-lg" />
            <span>Features</span>
          </Link>

          <Link to="/guidelines" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-all">
            <LuBookOpenCheck className="text-lg" />
            <span>Guidelines</span>
          </Link>

          <div className="my-2 border-t border-slate-800" />

          {user ? (
            <>
              <Link to="/user" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-all">
                <LuLayoutDashboard className="text-lg" />
                <span>Dashboard</span>
              </Link>

              <Link to="/user/profile" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-all">
                <LuUser className="text-lg" />
                <span>Profile</span>
              </Link>

              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-left">
                <FiLogOut className="text-lg" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-all">
                <LuLogIn className="text-lg" />
                <span>Login</span>
              </Link>

              <Link to="/signup" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-all">
                <LuUserPlus className="text-lg" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}