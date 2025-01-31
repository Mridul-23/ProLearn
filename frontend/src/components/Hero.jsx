import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 min-h-[65dvh] py-20 font-mon">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6">
          Your AI-Powered Learning Hub
        </h1>
        <p className="text-xl text-gray-400 mb-8 font-poppins">
          Adaptive content, smart study plans, and collaborative tools — all tailored for you.
        </p>
        <div className="flex sm:flex-row flex-col justify-center items-center space-x-0 sm:space-y-0 space-y-1 sm:space-x-1 font-poppin">
          <Link 
            to="/signup" 
            className="sm:max-w-auto max-w-48 bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            to="/features" 
            className="sm:max-w-auto max-w-48 bg-gray-900 text-indigo-400 px-8 py-3 rounded-lg text-lg border-[1.5px] border-indigo-600 hover:bg-[#162034] hover:text-[#5f75d1] transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}