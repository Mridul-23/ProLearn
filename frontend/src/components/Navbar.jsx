import { Link } from 'react-router-dom';
import "./component.css"

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 font-poppins">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      {/* Logo */}
      <Link to="/" className="flex flex-col justify-center items-center group">
        <span className="uppercase text-2xl logo-gradient font-bold font-sans">
          ProLearn
        </span>
        <div className='select-none uppercase text-center tracking-widest text-[0.55rem] -mt-1 font-normal text-indigo-300'>
              <span className='font-bold text-[#98bfff]'>Pro</span>fessional 
              <span className='font-bold text-[#98bfff]'> Learn</span>ing 
            </div>
      </Link>
          {/* Desktop Menu */}
          <div className="hidden sm:flex justify-center items-center space-x-8">
            <Link 
              to="/features" 
              className="text-gray-300 hover:text-indigo-400 transition-colors"
            >
              Features
            </Link>
            <Link 
              to="/login" 
              className="text-gray-300 hover:text-indigo-400 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
          {/* Mobile Menu */}
          <div className="sm:hidden flex justify-center items-center space-x-8">
            <button className="text-gray-300 hover:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            </div>
        </div>
      </div>
    </nav>
  );
}