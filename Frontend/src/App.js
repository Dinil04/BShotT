import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import Practice from './pages/Practice';
import About from './pages/About';
import Contact from './pages/Contact';
import ShotDetection from './pages/ShotDetection';
import Login from './pages/Login';
import SignUp from './pages/SignUp'; // import it at the top!

// Styles
import './styles/App.css'; // optional

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shot-detection" element={<ShotDetection />} />
        <Route path="/login" element={<Login />} />  {/* ✅ Login page */}
        <Route path="/signup" element={<SignUp />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

