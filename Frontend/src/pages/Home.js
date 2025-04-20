import React, { useState } from 'react'; // ✅ Added useState for FAQ toggle
import './Home.css';
import {
  FaUpload,
  FaBrain,
  FaChartLine,
  FaLock,
  FaVideo,
  FaLightbulb,
  FaPlus,
  FaMinus
} from 'react-icons/fa';

const Home = () => {
  const handleMouseEnter = (e) => {
    e.target.play();
  };

  const handleMouseLeave = (e) => {
    e.target.pause();
    e.target.currentTime = 0;
  };

  // ✅ FAQ Toggle
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="home-container">

      {/* HERO SECTION */}
      <section className="hero-section">
        <video className="hero-video" autoPlay muted loop>
          <source src={require('../assets/Home.mov')} type="video/mp4" />
        </video>

        <div className="hero-content">
          <h1>
          <span className="highlights">Experience</span> <span className="highlight">AI-Powered</span><span className="highlights"> Cricket Shot Analysis!
          </span></h1>
          <p> <span className="highlights">Analyze your cricket shots with precision and improve your game like a pro.</span></p>

          <div className="hero-buttons">
            <a href="/Practice" className="btn-primary">Get Started</a>
            <a href="#how-it-works" className="btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

            {/* DEMO GALLERY SECTION */}
            <section id="demo-gallery" className="demo-gallery-section">
        <h2>See It In Action!</h2>
        <p className="demo-description">Explore the classification of different shots powered by our AI system.</p>

        <div className="video-gallery">

          {/* Cover Drive */}
          <div className="video-item">
            <video
              muted
              playsInline
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="rotated-video"
            >
              <source src={require('../assets/cover_drive.mp4')} type="video/mp4" />
            </video>
            <h3>Cover Drive</h3>
          </div>

          {/* Defence */}
          <div className="video-item">
            <video
              muted
              playsInline
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="rotated-video"
            >
              <source src={require('../assets/defence.mp4')} type="video/mp4" />
            </video>
            <h3>Defence</h3>
          </div>

          {/* Pull Shot */}
          <div className="video-item">
            <video
              muted
              playsInline
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="rotated-video"
            >
              <source src={require('../assets/pull_shot.mp4')} type="video/mp4" />
            </video>
            <h3>Pull Shot</h3>
          </div>

          {/* Cut Shot */}
          <div className="video-item">
            <video
              muted
              playsInline
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="rotated-video"
            >
              <source src={require('../assets/cut_shot.mp4')} type="video/mp4" />
            </video>
            <h3>Cut Shot</h3>
          </div>

          {/* Sweep Shot */}
          <div className="video-item">
            <video
              muted
              playsInline
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="rotated-video"
            >
              <source src={require('../assets/sweep_shot.mp4')} type="video/mp4" />
            </video>
            <h3>Sweep Shot</h3>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="how-it-works-section">
        <h2>How It Works</h2>
        <p className="how-it-works-description">It's super easy! Follow these 3 simple steps:</p>

        <div className="steps-container">
          <div className="step-box">
            <FaUpload className="step-icon" />
            <h3>Step 1</h3>
            <p>Upload your cricket shot video for analysis.</p>
          </div>

          <div className="step-box">
            <FaBrain className="step-icon" />
            <h3>Step 2</h3>
            <p>Our AI system detects and classifies your cricket shot instantly.</p>
          </div>

          <div className="step-box">
            <FaChartLine className="step-icon" />
            <h3>Step 3</h3>
            <p>Get detailed feedback and performance insights to improve your game!</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features-section">
        <h2>Key Features</h2>
        <p className="features-description">Packed with powerful tools to elevate your cricket skills.</p>

        <div className="features-container">
          <div className="feature-box">
            <FaBrain className="feature-icon" />
            <h3>AI-Powered Shot Classification</h3>
            <p>Leverage advanced AI to recognize and classify cricket shots with precision.</p>
          </div>

          <div className="feature-box">
            <FaChartLine className="feature-icon" />
            <h3>Detailed Accuracy & Scores</h3>
            <p>Get insights on shot accuracy, speed, and performance with detailed analytics.</p>
          </div>

          <div className="feature-box">
            <FaLightbulb className="feature-icon" />
            <h3>Improve Your Batting</h3>
            <p>Use actionable feedback to practice, refine, and perfect your cricket shots.</p>
          </div>

          <div className="feature-box">
            <FaVideo className="feature-icon" />
            <h3>Easy Video Upload</h3>
            <p>Simply upload videos directly from your device—no complex setup needed.</p>
          </div>

          <div className="feature-box">
            <FaLock className="feature-icon" />
            <h3>Secure & Private</h3>
            <p>Your uploaded videos and data are protected with top-level security.</p>
          </div>
        </div>
      </section>


      {/* ✅ FAQ SECTION */}
      <section id="faq" className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <p className="faq-description">Find answers to common questions below.</p>

        <div className="faq-container">
          {[
            {
              question: 'What video formats do you support?',
              answer: 'We support MP4, MOV, AVI, and WebM formats for analysis.'
            },
            {
              question: 'How fast is the analysis?',
              answer: 'The system provides analysis within 5-10 seconds per video.'
            },
            {
              question: 'Is my data secure?',
              answer: 'Absolutely! All uploaded videos are encrypted and securely stored.'
            },
            {
              question: 'Can I use this on mobile devices?',
              answer: 'Yes, our platform is fully responsive for desktop and mobile users.'
            }
          ].map((faq, index) => (
            <div
              key={index}
              className="faq-item"
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                {openFAQ === index ? (
                  <FaMinus className="faq-icon" />
                ) : (
                  <FaPlus className="faq-icon" />
                )}
              </div>
              {openFAQ === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ✅ CTA SECTION */}
<section className="cta-section">
  <div className="cta-content">
    <h2>Start Improving Your Shots Today with AI!</h2>
    <p>Upload your cricket videos and get instant feedback powered by AI technology.</p>
    <a href="/Practice" className="cta-button">Get Started</a>
  </div>
</section>

    </div>
  );
};

export default Home;
