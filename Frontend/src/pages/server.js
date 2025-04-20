const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse JSON requests
app.use(cors());
app.use(bodyParser.json());

// Create a transporter using SMTP (example with Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Can use other services like Yahoo or Outlook
  auth: {
    user: 'your-email@gmail.com', // Replace with your email address
    pass: 'your-email-password',  // Use an app-specific password if using Gmail
  },
});

// POST route to send email
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Setup email data
  const mailOptions = {
    from: email,  // Sender's email address
    to: 'recipient-email@example.com',  // Replace with the recipient's email address
    subject: `Message from ${name}`,
    text: `You have received a new message from ${name} (${email}).\n\nMessage:\n${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email', error });
    } else {
      return res.status(200).json({ message: 'Email sent successfully', info });
    }
  });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
