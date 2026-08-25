import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './component.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const name = user?.display_name || user?.username || 'Learner';
  const initial = name.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 font-poppins">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link
            to="/"
            className="flex flex-col justify-center items-start group"
          >
            <span className="uppercase text-2xl logo-gradient font-bold font-sans tracking-tight">
              ProLearn
            </span>
            <div className="select-none uppercase tracking-widest text-[0.5rem] -mt-1 font-normal text-slate-400">
              <span className="font-bold text-indigo-400">Pro</span>
              fessional
              <span className="font-bold text-indigo-400"> Learn</span>
              ing
            </div>
          </Link>

          {/* ================= LOGGED IN ================= */}
          {user ? (
            <div className="flex items-center gap-4">
              {/* Profile */}
              <Link
                to="/user/profile"
                className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-200">
                    {name}
                  </p>
                  <p className="text-xs text-slate-400">
                    @{user.username}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold shadow-inner">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 transition-all text-sm font-medium"
                title="Logout"
              >
                <FiLogOut className="text-base" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              {/* ================= LOGGED OUT (Desktop) ================= */}
              <div className="hidden sm:flex items-center gap-8">
                <Link
                  to="/features"
                  className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors"
                >
                  Features
                </Link>

                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile Hamburger Button */}
              <div className="flex sm:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                >
                  {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu (Logged Out) */}
      {!user && mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 font-poppins">
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            Features
          </Link>
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-md"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}