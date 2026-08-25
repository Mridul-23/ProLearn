import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 font-poppins pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <span className="uppercase text-2xl logo-gradient font-bold font-sans tracking-tight text-white">
              ProLearn
            </span>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A focused learning workspace for creating study plans,
              tracking progress, discovering resources, and learning
              with an AI tutor.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/Mridul-23"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
              >
                <FiGithub className="text-lg" />
              </a>

              <a
                href="https://x.com/mridulnarula_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
              >
                <FiTwitter className="text-lg" />
              </a>

              <a
                href="https://www.linkedin.com/in/mridul-narula-55338524b"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
              >
                <FiLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-mon">
              Platform
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/features"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link
                  to="/user"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/user/study-plan"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Study Plans
                </Link>
              </li>

              <li>
                <Link
                  to="/user/resources"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Resources
                </Link>
              </li>

              <li>
                <Link
                  to="/user/ai-tutor"
                  className="hover:text-indigo-400 transition-colors"
                >
                  AI Tutor
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-mon">
              Account
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/login"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Log In
                </Link>
              </li>

              <li>
                <Link
                  to="/signup"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/user/profile"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} ProLearn. All rights reserved.
          </p>

          <p className="text-slate-600">
            AI-powered learning with your own Gemini API key.
          </p>
        </div>

      </div>
    </footer>
  );
}