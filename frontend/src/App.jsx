import { useContext } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import "./App.css"
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainLayout from './components/MainLayout';
import AITutor from './pages/AITutor';
import Resources from './pages/Resources';
import StudyPlan from './pages/StudyPlan';
import FeaturesPage from './pages/FeaturesPage';
import { AuthContext } from './context/AuthContext';

// Route wrappers are internal composition helpers; React Router supplies the child element.
// eslint-disable-next-line react/prop-types
function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={ <LandingPage /> } />
            <Route path="/features" element={ <FeaturesPage /> } />
            <Route path="/user" element={<RequireAuth><MainLayout /></RequireAuth>}>
              <Route index element={<Dashboard />} />
              <Route path="study-plan" element={<StudyPlan />} />
              <Route path="resources" element={<Resources />} />
              <Route path="ai-tutor" element={<AITutor />} />
            </Route>
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="/signup" element={ <SignupPage /> } />
            <Route path="*" element={ <h1 className='text-5xl font-bold uppercase mt-30 text-indigo-200 text-center'>404 Not Found</h1> }/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
