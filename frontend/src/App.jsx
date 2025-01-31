import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import "./App.css"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Base URL: Landing Page */}
            <Route 
              path="/" 
              element={
                <>
                  <Hero />
                  <Features />
                </>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}