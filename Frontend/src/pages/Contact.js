import React, { useState } from 'react';
import './Contact.css';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    // For now, just display a confirmation message
    setFormStatus('Thank you for your message! We will get back to you shortly.');
  };

  return (
    <div className="contact-container">
      {/* Contact Info Section */}
      <div className="contact-info">
        <h2>Contact Information</h2>
        <div className="info-item">
          <h3>Phone Number</h3>
          <p>(+94) 71 115 1067</p>
        </div>
        <div className="info-item">
          <h3>Address</h3>
          <p>No 61, Weedagama Road , Bandaragama</p>
        </div>
        <div className="info-item">
          <h3>Email</h3>
          <p>dinilhansindu2020@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
