const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
require('dotenv').config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Root route for health check
app.get('/', (req, res) => {
    res.json({ status: "ServerSide X API is active and running with Resend." });
});

// POST route to handle form submission
app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        console.log(`Received transmission from: ${name} (${email})`);

        // Send email using Resend API (Works on Render Free Tier!)
        const { data, error } = await resend.emails.send({
            from: 'ServerSideX <onboarding@resend.dev>',
            to: process.env.EMAIL_RECEIVER || 'kmanohar17072007@gmail.com',
            subject: `🚀 New Payload: ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee;">
                    <h2 style="color: #FF4500;">New Transmission Received</h2>
                    <p><strong>Identifier:</strong> ${name}</p>
                    <p><strong>Comm-Link:</strong> ${email}</p>
                    <hr>
                    <p><strong>Payload Data:</strong></p>
                    <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
                </div>
            `
        });

        if (error) {
            console.error("Resend Error:", error);
            return res.status(500).json({ error: 'Failed to send transmission.' });
        }

        console.log("Transmission sent successfully:", data.id);
        return res.json({ success: true, message: "Transmission payload secured and sent." });

    } catch (error) {
        console.error('System Error:', error);
        return res.status(500).json({ error: 'Fatal error establishing transmission link.' });
    }
});

app.listen(PORT, () => {
    console.log(`ServerSide X API running on port ${PORT}`);
});
