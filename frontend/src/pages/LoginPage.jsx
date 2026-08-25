import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  SparklesIcon,
  LockClosedIcon,
  UserIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const success = await login(username.trim(), password);

      if (success) {
        navigate(
          location.state?.from?.pathname || '/user',
          { replace: true }
        );
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center font-poppins px-4 relative overflow-hidden py-12">

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md">

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-800/80 relative overflow-hidden"
        >

          {/* Top highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Welcome Back</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              Sign in to{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                ProLearn
              </span>
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Continue your learning journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Username
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="w-4 h-4" />
              </div>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/60 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <LockClosedIcon className="w-4 h-4" />
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/60 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl transition-all duration-200 font-medium text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>

            {!loading && (
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>

          {/* Signup */}
          <p className="mt-6 text-center text-slate-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;