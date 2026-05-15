require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
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

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;
    
    // Basic backend validation
    if (!name || !email || !message) {
        return res.status(400).send("All fields are required.");
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
        // This prevents the UI from hanging if the cloud provider (like Render Free Tier) blocks SMTP ports.
        if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
            transporter.sendMail(mailOptions)
                .then(() => console.log(`Email sent successfully to ${process.env.EMAIL_RECEIVER}`))
                .catch(err => console.error("Background Email Error (SMTP might be blocked):", err.message));
        } else {
            console.log("⚠️ WARNING: Email not sent. Please configure the .env file with your real email credentials.");
        }

        // Render the success page immediately without waiting for the email to finish sending.
        res.render('success', { name });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error establishing transmission link. Please try again later.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
