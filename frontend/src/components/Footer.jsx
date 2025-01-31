export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 text-center">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-center items-center space-x-8 pb-4">
          {/* Footer sections here (About, Resources, etc.) */}
          <div>
            <h4 className="text-4xl font-bold font-sans mb-4">ProLearn</h4>
            <p className="text-gray-500 text-lt">
              Empowering learners with AI-driven tools.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ProLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}