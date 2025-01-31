import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import "./App.css"
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={ <LandingPage /> } 
            />
            <Route 
              path="/dashboard" 
              element={ <Dashboard /> }  
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}