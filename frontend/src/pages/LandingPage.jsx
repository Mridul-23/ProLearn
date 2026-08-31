import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "AI Study Plans",
    description:
      "Turn any subject into a focused five-step learning roadmap generated with Gemini.",
    icon: BookOpenIcon,
    gradient:
      "from-indigo-500/20 via-purple-500/10 to-transparent",
  },
  {
    title: "Track Your Progress",
    description:
      "Complete roadmap steps, track focus time, set weekly goals, and see your learning progress.",
    icon: CalendarIcon,
    gradient:
      "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
  {
    title: "AI Tutor",
    description:
      "Ask questions, explore concepts, and get interactive explanations using your own Gemini API key.",
    icon: ChatBubbleLeftIcon,
    gradient:
      "from-violet-500/20 via-fuchsia-500/10 to-transparent",
  },
];

function Hero() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100 py-26 font-mon">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8 backdrop-blur-md">
            <SparklesIcon className="w-4 h-4" />
            <span>
              Powered by Gemini • Bring Your Own Key
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Learn smarter with{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ProLearn
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 mb-10 font-poppins leading-relaxed">
            Create AI-powered study plans, track your progress, discover
            learning resources, and get help from an interactive AI tutor —
            all in one workspace.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 font-poppins">
            <Link
              to="/user"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-indigo-600/25 transition-all duration-200 group"
            >
              Get Started Free

              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl font-medium border border-slate-800 hover:border-slate-700 backdrop-blur-sm transition-all duration-200"
            >
              Explore Features
            </Link>
          </div>

          {/* Trust / product characteristics */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-poppins">
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-indigo-400" />
              Bring your own Gemini key
            </span>

            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-indigo-400" />
              Your key stays in your browser
            </span>

            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-indigo-400" />
              Track your learning progress
            </span>
          </div>
        </div>

        {/* Product Preview */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-slate-900/60 border border-slate-800/80 p-2 shadow-2xl backdrop-blur-xl relative">

          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-2xl pointer-events-none" />

          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800/50">

            {/* Window bar */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              <span className="text-xs text-slate-500 font-mono">
                prolearn-workspace
              </span>
            </div>

            {/* Preview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">

              {/* Focus */}
              <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                <div className="text-xs font-semibold text-indigo-400 mb-1">
                  Today&apos;s Focus
                </div>

                <div className="text-2xl font-bold text-slate-200">
                  45 min
                </div>

                <div className="text-xs text-slate-500 mt-2">
                  Focus time tracked today
                </div>

                <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 w-3/4 h-full rounded-full" />
                </div>
              </div>

              {/* AI Tutor */}
              <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                <div className="text-xs font-semibold text-purple-400 mb-1">
                  AI Tutor
                </div>

                <div className="text-sm font-medium text-slate-200">
                  Explain React hooks...
                </div>

                <div className="mt-2 text-xs text-slate-400 bg-slate-950 p-2 rounded border border-slate-800/50 truncate">
                  Ask anything and learn interactively.
                </div>
              </div>

              {/* Study Plan */}
              <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                <div className="text-xs font-semibold text-emerald-400 mb-1">
                  Study Plan
                </div>

                <div className="text-sm font-medium text-slate-200">
                  Advanced React
                </div>

                <div className="mt-3 text-xs text-slate-400">
                  ✓ 5 of 5 steps completed
                </div>

                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className="h-1.5 flex-1 rounded-full bg-emerald-500"
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="py-24 bg-slate-950 font-mon relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-3">
            Built for Learning
          </h2>

          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Everything you need to learn with purpose
          </p>

          <p className="mt-4 text-slate-400 font-poppins">
            Plan what to learn, get help when you need it, and keep track of
            the progress you make.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative p-8 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div className="relative z-10">

                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed font-poppins">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom product statement */}
        <div className="mt-20 text-center">
          <p className="text-sm text-slate-500 font-poppins">
            Your learning data stays connected to your ProLearn account,
            while your Gemini API key stays under your control.
          </p>
        </div>

      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Hero />
      <Features />
    </div>
  );
}

export default LandingPage;