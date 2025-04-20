import React from 'react';
import './ScrollIndicator.css';
import { FaAngleDoubleDown } from 'react-icons/fa';

const ScrollIndicator = () => {
  return (
    <div className="scroll-indicator">
      {/* Bat handle */}
      <div className="bat-handle"></div>

      {/* Scroll box */}
      <div className="scroll-box">
        <span className="scroll-text">Scroll</span>
        <FaAngleDoubleDown className="scroll-icon" />
        <div className="scroll-ball"></div>
      </div>
    </div>
  );
};

export default ScrollIndicator;
