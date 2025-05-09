import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import "./App.css"
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import AITutor from './pages/AITutor';
import Resources from './pages/Resources';
import StudyPlan from './pages/StudyPlan';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={ <LandingPage /> } />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/user" element={ <MainLayout /> }>
              <Route index element={<Dashboard />} />
              <Route path="study-plan" element={<StudyPlan />} />
              <Route path="resources" element={<Resources />} />
              <Route path="ai-tutor" element={<AITutor />} />
            </Route>
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="*" element={ <h1 className='text-5xl font-bold uppercase mt-30 text-indigo-200 text-center'>404 Not Found</h1> }/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}