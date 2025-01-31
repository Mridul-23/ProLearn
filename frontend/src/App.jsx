import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import "./App.css"
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={ <LandingPage /> } />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="*" element={ <h1 className='text-4xl text-indigo-100 text-center'>404 Not Found</h1> }/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}