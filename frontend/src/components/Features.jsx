import { BookOpenIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const features = [
  { title: "Personalized Recommendations", description: "AI-curated content based on your learning style.", icon: BookOpenIcon },
  { title: "Adaptive Study Planner", description: "Smart scheduling powered by reinforcement learning.", icon: CalendarIcon },
  { title: "AI Tutor Chat", description: "Instant answers with BERT/GPT-powered chatbot.", icon: ChatBubbleLeftIcon },
];

export default function Features() {
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