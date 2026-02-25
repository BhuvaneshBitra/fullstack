import React from 'react';
import { FaBook, FaLaptopCode, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to <span className="highlight">Digital Library</span> 🎓</h1>
          <p className="subtitle">Discover, learn, and grow with our vast collection of digital resources available at your fingertips.</p>
          <div className="hero-buttons">
            <Link to="/register"><button className="btn-primary">Get Started</button></Link>
            <Link to="/login"><button className="btn-secondary">Login</button></Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon-wrapper"><FaBook className="icon" /></div>
            <h3>Vast Collection</h3>
            <p>Access thousands of e-books, journals, and articles anytime, anywhere.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper"><FaLaptopCode className="icon" /></div>
            <h3>Read Anywhere</h3>
            <p>Seamlessly sync your progress across all your devices.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper"><FaUsers className="icon" /></div>
            <h3>Connect</h3>
            <p>Join a community of avid readers and learners worldwide.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
