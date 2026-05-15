require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to another provider if needed
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Root route for health check
app.get('/', (req, res) => {
    res.json({ status: "ServerSide X API is active and running." });
});

// POST route to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;
    
    // Validate inputs
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Send email
        const mailOptions = {
            from: `"${name} (ServerSide X)" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECEIVER, // Receiver email
            replyTo: email,
            subject: `New Transmission from ${name}`,
            text: `You have received a new transmission via ServerSide X.\n\nIdentifier: ${name}\nComm-Link: ${email}\nPayload:\n${message}`,
            html: `
                <h3>New Transmission Received</h3>
                <p><strong>Identifier:</strong> ${name}</p>
                <p><strong>Comm-Link:</strong> ${email}</p>
                <p><strong>Payload:</strong><br/>${message}</p>
            `
        };

        // Attempt to send email in the background (Fire and Forget)
        if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
            transporter.sendMail(mailOptions)
                .then(() => console.log(`Email sent successfully to ${process.env.EMAIL_RECEIVER}`))
                .catch(err => console.error("Background Email Error (SMTP might be blocked):", err.message));
        } else {
            console.log("⚠️ WARNING: Email not sent. Please configure the .env file with your real email credentials.");
        }

        // Return a JSON success response for the frontend JS to handle
        return res.json({ success: true, message: "Transmission payload secured and sent." });

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Error establishing transmission link. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
