import React from 'react'
import { Link } from 'react-router-dom';
import { BookOpenIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const features = [
  { title: "Personalized Recommendations", description: "AI-curated content based on your learning style.", icon: BookOpenIcon },
  { title: "Adaptive Study Planner", description: "Smart scheduling powered by reinforcement learning.", icon: CalendarIcon },
  { title: "AI Tutor Chat", description: "Instant answers with BERT/GPT-powered chatbot.", icon: ChatBubbleLeftIcon },
];

function Features() {
  return (
    <div className="py-16 bg-gray-900 font-mon">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center uppercase text-gray-100 mb-12">
          Why Choose ProLearn?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="p-6 bg-gray-800 rounded-xl shadow-xl hover:bg-[#262e3b67] transition-colors duration-[2s]"
            >
              <feature.icon className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
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


function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
    </>
  )
}

export default LandingPage;