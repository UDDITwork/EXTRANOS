const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const db = require('./config/db');
const missionRoutes = require('./routes/missions');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', missionRoutes);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email notification function
const sendProgressEmails = async () => {
    try {
        // Get all missions with their targets
        const { rows: missions } = await db.query(`
            SELECT 
                m.id, 
                m.title,
                COUNT(t.id) as total_targets,
                COUNT(CASE WHEN t.is_completed THEN 1 END) as completed_targets
            FROM missions m
            LEFT JOIN targets t ON m.id = t.mission_id
            WHERE m.is_finalized = true
            GROUP BY m.id, m.title
        `);

        const recipients = [
            'udditalerts247@gmail.com',
            'udditkantsinha@gmail.com',
            'udditkantsinha2@gmail.com',
            '2021umt1791@mnit.ac.in',
            'uddit@inventip.in'
        ];

        for (const mission of missions) {
            if (mission.total_targets > 0) {
                const progress = (mission.completed_targets / mission.total_targets * 100).toFixed(2);
                
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: recipients.join(', '),
                    subject: `Mission Progress Update - ${mission.title}`,
                    text: `Hello Mr. Uddit;\n\nEXTRANOS this side, I have a message for you;\nMISSION: ${mission.title}\nProgress Update: ${mission.completed_targets}/${mission.total_targets}\nYou have achieved ${progress}% of your mission, KEEP GOING.`
                };

                await transporter.sendMail(mailOptions);
                console.log(`Progress email sent for mission: ${mission.title}`);
            }
        }
    } catch (error) {
        console.error('Error sending progress emails:', error);
    }
};

// Schedule email notifications every 2 hours
cron.schedule('0 */2 * * *', sendProgressEmails);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Email notifications scheduled for every 2 hours');
});