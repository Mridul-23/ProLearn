import {
  BookOpenIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  UserCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Study Plans",
    description:
      "Enter a subject and let Gemini turn it into a focused five-step learning roadmap.",
    icon: BookOpenIcon,
    accent: "from-blue-500/20 via-indigo-500/10 to-transparent",
    iconColor: "text-blue-400",
  },
  {
    title: "Interactive Roadmaps",
    description:
      "Mark individual study steps as completed and keep your roadmap progress synchronized with your account.",
    icon: CalendarIcon,
    accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconColor: "text-emerald-400",
  },
  {
    title: "AI Tutor",
    description:
      "Ask questions, get explanations, and learn interactively with your own Gemini API key.",
    icon: ChatBubbleLeftIcon,
    accent: "from-purple-500/20 via-indigo-500/10 to-transparent",
    iconColor: "text-purple-400",
  },
  {
    title: "Learning Progress",
    description:
      "Track your focus time, set weekly goals, and visualize your learning activity from the dashboard.",
    icon: ChartBarIcon,
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconColor: "text-amber-400",
  },
  {
    title: "Resource Discovery",
    description:
      "Search YouTube videos and Medium articles for additional material related to what you're learning.",
    icon: MagnifyingGlassIcon,
    accent: "from-cyan-500/20 via-blue-500/10 to-transparent",
    iconColor: "text-cyan-400",
  },
  {
    title: "Save What Matters",
    description:
      "Save useful videos, articles, and AI Tutor responses to your personal resource collection.",
    icon: BookmarkIcon,
    accent: "from-pink-500/20 via-rose-500/10 to-transparent",
    iconColor: "text-pink-400",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-slate-950 min-h-screen font-poppins text-slate-100 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-indigo-600/15 blur-[150px] pointer-events-none rounded-full" />

      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="relative max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 backdrop-blur-md">
            <SparklesIcon className="w-4 h-4" />
            <span>Built for Focused Learning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              learn with purpose
            </span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed">
            Build study plans, work through learning roadmaps, discover useful
            resources, track your progress, and get help from your AI tutor.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative p-8 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div className="relative z-10">

                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Icon
                      className={`h-6 w-6 ${feature.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* BYOK section */}
      <section className="py-20 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">

          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <UserCircleIcon className="w-7 h-7 text-indigo-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Gemini key, your control
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ProLearn uses a bring-your-own-key approach for Gemini. Add your
            API key to your profile and use Gemini-powered features directly
            from your learning workspace.
          </p>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-950 border-t border-slate-900 relative">
        <div className="max-w-3xl mx-auto text-center px-4">

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to start learning?
          </h2>

          <p className="text-slate-400 mb-8 text-base sm:text-lg">
            Create your account and build your first study plan.
          </p>

          <Link
            to="/user"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-medium text-base hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all duration-200 group"
          >
            Get Started
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

        </div>
      </section>
    </div>
  );
}