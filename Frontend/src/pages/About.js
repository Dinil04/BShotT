import React from 'react';
import './About.css';
import AboutImage from '../assets/about.jpg'; // Ensure the correct path for the About Image
import DinilImage from '../assets/dinil.jpg'; // Ensure the correct path for your Image
import { FaFacebook, FaLinkedin } from 'react-icons/fa'; // Social media icons
import { FaReact, FaNodeJs, FaPython, FaAws, FaDatabase } from 'react-icons/fa'; // Technology Stack Icons

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>

      {/* Vision Section */}
      <div className="about-box">
        <div className="about-section">
          <div className="about-image">
            <img src={AboutImage} alt="About Cricket Shots Analysis Platform" />
          </div>
          <div className="about-text">
            <h2>Our Vision</h2>
            <p>
              To empower players globally to play sports, stay fit, and achieve their true potential by breaking the barrier of physical places to train and the right coaches to train with.
            </p>
          </div>
        </div>
      </div>

      {/* Developed By Section */}
      <div className="about-box">
        <div className="about-section">
          <div className="about-image">
            <img src={DinilImage} alt="Dinil Perera" />
          </div>
          <div className="about-text">
            <h2>Developed By</h2>
            <h3>Dinil Perera</h3>
            <p>Undergraduate Final Year Software Engineering Student</p>
            <p>A passionate software engineer with a focus on enhancing sports analytics through AI.</p>
            <div className="social-links">
              <a href="https://web.facebook.com/dinil.hansindu/" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://www.linkedin.com/in/dinil-perera-320b84267/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="technology-stack-section">
        <h2>Technology Stack</h2>
        <p>We have used a combination of modern technologies to bring this platform to life. Here are some of the key technologies that power our platform:</p>

        <div className="tech-stack">
          <div className="tech-item">
            <FaReact size={50} />
            <h3>React</h3>
            <p>A JavaScript library for building user interfaces, allowing us to create a fast and dynamic front-end.</p>
          </div>

          <div className="tech-item">
            <FaNodeJs size={50} />
            <h3>Node.js</h3>
            <p>A JavaScript runtime for building scalable back-end services that can handle concurrent connections.</p>
          </div>

          <div className="tech-item">
            <FaPython size={50} />
            <h3>Python</h3>
            <p>Used for implementing the machine learning models and backend logic to analyze cricket shots.</p>
          </div>

          <div className="tech-item">
            <FaAws size={50} />
            <h3>AWS</h3>
            <p>Amazon Web Services is used for cloud hosting, providing scalability, security, and high availability for the platform.</p>
          </div>

          <div className="tech-item">
            <FaDatabase size={50} />
            <h3>MongoDB</h3>
            <p>A NoSQL database used for storing user data, match statistics, and analysis results.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
