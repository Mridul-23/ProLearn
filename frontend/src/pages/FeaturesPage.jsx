import React from 'react';
import { BookOpenIcon, CalendarIcon, ChatBubbleLeftIcon, ChartBarIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "Personalized Recommendations",
    description: "Our AI analyzes your learning style and progress to curate the most effective content for you. No more One-Size-Fits-All learning.",
    icon: BookOpenIcon,
    color: "text-blue-400"
  },
  {
    title: "Adaptive Study Planner",
    description: "Stay on track with a dynamic schedule that adjusts to your pace. Powered by reinforcement learning to optimize your study sessions.",
    icon: CalendarIcon,
    color: "text-green-400"
  },
  {
    title: "AI Tutor Chat",
    description: "Stuck on a concept? Get instant, accurate answers and explanations from our advanced BERT/GPT-powered chatbot tutor.",
    icon: ChatBubbleLeftIcon,
    color: "text-purple-400"
  },
  {
    title: "Progress Tracking",
    description: "Visualize your growth with detailed analytics. Identify strengths and areas for improvement with real-time data.",
    icon: ChartBarIcon,
    color: "text-yellow-400"
  },
  {
    title: "Collaborative Learning",
    description: "Connect with peers, share resources, and study together in a focused, community-driven environment.",
    icon: UserGroupIcon,
    color: "text-pink-400"
  },
  {
    title: "Expert Resources",
    description: "Access a vast library of high-quality verified materials, from video lectures to interactive quizzes.",
    icon: AcademicCapIcon,
    color: "text-red-400"
  }
];

export default function FeaturesPage() {
  return (
    <div className="bg-gray-900 min-h-screen font-poppins text-gray-100">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
             <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Unlock Potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">ProLearn</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Experience a new era of education powered by advanced artificial intelligence. tailored just for you.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className={`w-14 h-14 rounded-lg bg-gray-900 flex items-center justify-center mb-6 shadow-lg border border-gray-700 group-hover:border-indigo-500/30 transition-colors`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your learning?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join thousands of students already learning smarter with ProLearn.</p>
          <Link 
            to="/signup" 
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}
