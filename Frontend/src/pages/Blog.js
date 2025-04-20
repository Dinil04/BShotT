import React, { useState, useEffect, useRef } from 'react';
import './Blog.css';
import { FaArrowDown, FaArrowUp, FaSearch } from 'react-icons/fa';

// Import images
import CoverDriveImg from '../assets/c.jpg';
import DefenceImg from '../assets/d.jpg';
import CutShotImg from '../assets/cu.jpg';
import PullShotImg from '../assets/p.jpg';
import SweepShotImg from '../assets/sw.jpg';

const BlogPage = () => {
  const [showCoverDrive, setShowCoverDrive] = useState(false);
  const [showDefence, setShowDefence] = useState(false);
  const [showCutShot, setShowCutShot] = useState(false);
  const [showPullShot, setShowPullShot] = useState(false);
  const [showSweepShot, setShowSweepShot] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [showFAQ, setShowFAQ] = useState(false);

  const coverDriveRef = useRef(null);
  const defenceRef = useRef(null);
  const cutShotRef = useRef(null);
  const pullShotRef = useRef(null);
  const sweepShotRef = useRef(null);

  // Filter shots based on search query
  const filterShots = (shotName, description) => {
    return (
      shotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(coverDriveRef.current);
    observer.observe(defenceRef.current);
    observer.observe(cutShotRef.current);
    observer.observe(pullShotRef.current);
    observer.observe(sweepShotRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Toggle FAQ visibility
  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  return (
    <div className="blog-page-container">
      <div className="blog-content">
        <h2>Cricket Shots Analysis</h2>
        <p>Discover the most elegant and powerful cricket shots played by the legends. Learn how to master them with step-by-step instructions and tips.</p>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for shots or techniques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>

        {/* Cover Drive */}
        {filterShots('Cover Drive', 'What better sight than seeing a batsman play a classic cover drive.') && (
          <div className="shot-container" ref={coverDriveRef}>
            <h3>1. Cover Drive</h3>
            <p>
              What better sight than seeing a batsman play a classic cover drive. It is one of the most elegant shots that a batsman can play...
            </p>
            <button
              className="read-more-btn"
              onClick={() => setShowCoverDrive(!showCoverDrive)}
            >
              {showCoverDrive ? (
                <>
                  <FaArrowUp /> Hide Details
                </>
              ) : (
                <>
                  <FaArrowDown /> Read More
                </>
              )}
            </button>

            {showCoverDrive && (
              <div className="shot-description">
                <img src={CoverDriveImg} alt="Cover Drive" />
                <h4>How to play a Cover Drive</h4>
                <ul>
                  <li>Bring your front foot in line of the ball...</li>
                  <li>The head should be over the knee of the front leg...</li>
                  <li>The gap between the cover fielders should be your target.</li>
                  <li>Perfectly time the shot while keeping your front elbow raised.</li>
                </ul>
                <p><strong>Best Players:</strong> Virat Kohli, Babar Azam, Kumar Sangakkara</p>
              </div>
            )}
          </div>
        )}

        {/* Defence */}
        {filterShots('Defence', 'Not all good and full-length deliveries can be driven away.') && (
          <div className="shot-container" ref={defenceRef}>
            <h3>2. Defence</h3>
            <p>
              Not all good and full-length deliveries can be driven away. If they’re bowled directly in the line of the stumps, it’s better to play the front foot defence...
            </p>
            <button
              className="read-more-btn"
              onClick={() => setShowDefence(!showDefence)}
            >
              {showDefence ? (
                <>
                  <FaArrowUp /> Hide Details
                </>
              ) : (
                <>
                  <FaArrowDown /> Read More
                </>
              )}
            </button>

            {showDefence && (
              <div className="shot-description">
                <img src={DefenceImg} alt="Defence" />
                <h4>How to play the Front Foot Defence</h4>
                <ul>
                  <li>Bring your front foot closer to the ball's pitch and line.</li>
                  <li>As you lower the bat, try to keep as little space as possible between it and the pad.</li>
                  <li>Play with "soft hands" to avoid edges.</li>
                </ul>
                <p><strong>Best Players:</strong> Virat Kohli, Steve Smith, Mahela Jayawardhana</p>
              </div>
            )}
          </div>
        )}

        {/* Cut Shot */}
        {filterShots('Cut Shot', 'The cut shot is used to punish balls bowled outside the off stump.') && (
          <div className="shot-container" ref={cutShotRef}>
            <h3>3. Cut Shot</h3>
            <p>
              The cut shot is used to punish balls bowled outside the off stump. It is played late and targets the point and backward point region...
            </p>
            <button
              className="read-more-btn"
              onClick={() => setShowCutShot(!showCutShot)}
            >
              {showCutShot ? (
                <>
                  <FaArrowUp /> Hide Details
                </>
              ) : (
                <>
                  <FaArrowDown /> Read More
                </>
              )}
            </button>

            {showCutShot && (
              <div className="shot-description">
                <img src={CutShotImg} alt="Cut Shot" />
                <h4>How to play the Cut Shot</h4>
                <ul>
                  <li>Judge the line and length early and create space.</li>
                  <li>Play with a horizontal bat and try to play late.</li>
                  <li>Shift your weight back onto your back foot for better control.</li>
                </ul>
                <p><strong>Best Players:</strong> Alastair Cook, Michael Clarke, Chris Gayle</p>
              </div>
            )}
          </div>
        )}

        {/* Pull Shot */}
        {filterShots('Pull Shot', 'The pull shot allows the batsman to dominate short-pitched deliveries.') && (
          <div className="shot-container" ref={pullShotRef}>
            <h3>4. Pull Shot</h3>
            <p>
              The pull shot allows the batsman to dominate short-pitched deliveries, often sending them to the boundary with ease...
            </p>
            <button
              className="read-more-btn"
              onClick={() => setShowPullShot(!showPullShot)}
            >
              {showPullShot ? (
                <>
                  <FaArrowUp /> Hide Details
                </>
              ) : (
                <>
                  <FaArrowDown /> Read More
                </>
              )}
            </button>

            {showPullShot && (
              <div className="shot-description">
                <img src={PullShotImg} alt="Pull Shot" />
                <h4>How to play the Pull Shot</h4>
                <ul>
                  <li>The ball should be between the waist and shoulder height.</li>
                  <li>Shift your weight onto your back foot and rotate your torso.</li>
                  <li>Roll your wrists on contact to hit the ball downwards.</li>
                </ul>
                <p><strong>Best Players:</strong> Viv Richards, Rohit Sharma, Ricky Ponting</p>
              </div>
            )}
          </div>
        )}

        {/* Sweep Shot */}
        {filterShots('Sweep Shot', 'The sweep shot is used to attack spinners by using a horizontal bat swing to hit the ball towards the leg side.') && (
          <div className="shot-container" ref={sweepShotRef}>
            <h3>5. Sweep Shot</h3>
            <p>
              The sweep shot is used to attack spinners by using a horizontal bat swing to hit the ball towards the leg side...
            </p>
            <button
              className="read-more-btn"
              onClick={() => setShowSweepShot(!showSweepShot)}
            >
              {showSweepShot ? (
                <>
                  <FaArrowUp /> Hide Details
                </>
              ) : (
                <>
                  <FaArrowDown /> Read More
                </>
              )}
            </button>

            {showSweepShot && (
              <div className="shot-description">
                <img src={SweepShotImg} alt="Sweep Shot" />
                <h4>How to play the Sweep Shot</h4>
                <ul>
                  <li>Step forward with your front foot and lower your stance.</li>
                  <li>Watch the ball closely while maintaining balance.</li>
                  <li>Swing the bat horizontally and aim for placement between the fielders.</li>
                </ul>
                <p><strong>Best Players:</strong> Joe Root, Steve Smith, Tillakaratne Dilshan</p>
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>FAQ: Common Questions about Cricket Shots</h2>
          <button className="faq-toggle" onClick={toggleFAQ}>
            {showFAQ ? 'Hide FAQs' : 'Show FAQs'}
          </button>
          {showFAQ && (
            <div className="faq-content">
              <div className="faq-item">
                <h4>Q: What is the best way to play a cover drive?</h4>
                <p>A: Position your head over your front knee and drive the ball with perfect timing towards the gap between cover fielders.</p>
              </div>
              <div className="faq-item">
                <h4>Q: How do I master the pull shot?</h4>
                <p>A: Make sure the ball is at the right height (between waist and shoulder), shift your weight back and rotate your torso for control.</p>
              </div>
              <div className="faq-item">
                <h4>Q: When should I use the sweep shot?</h4>
                <p>A: Use the sweep shot to attack spinners when the ball is pitched on the leg side. Step forward with your front foot for better placement.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default BlogPage;
