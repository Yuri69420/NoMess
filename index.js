const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const { URL } = require('url');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the thank you page
app.get('/thankyou.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'pages', 'thankyou.html'));
});

// Connect to MongoDB using the environment variable
const mongoURI = process.env.MONGODB_URI || 'your-default-mongodb-uri-here';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Initial MongoDB connection error:', err);
    });

const db = mongoose.connection;
db.on('error', (err) => {
    console.error('Connection error:', err);
});
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema and model for registrations
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    nationality: String
});

const Registration = mongoose.model('Registration', registrationSchema);

// Parse the CLOUDMAILIN_SMTP_URL
const smtpUrl = new URL(process.env.CLOUDMAILIN_SMTP_URL);
const transporter = nodemailer.createTransport({
    host: smtpUrl.hostname,
    port: parseInt(smtpUrl.port, 10),
    secure: false, // Use false for STARTTLS
    auth: {
        user: smtpUrl.username,
        pass: smtpUrl.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Routes
app.post('/register', (req, res) => {
    console.log('Received registration data:', req.body);

    const registration = new Registration(req.body);
    registration.save((err, registration) => {
        if (err) {
            console.error('Error saving registration:', err);
            return res.status(500).json({ message: 'Registration failed', error: err });
        }
        console.log('Registration successful:', registration);

        // Send registration confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: registration.email,
            subject: 'Registration Successful',
            text: `Dear ${registration.name},\n\nThank you for registering for WAKE. We look forward to seeing you at the event.\n\nBest regards,\nWAKE Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // Redirect to thankyou.html on success
        res.redirect('/thankyou.html');
    });
});

app.post('/contact', (req, res) => {
    console.log('Received contact data:', req.body);
    res.json({ message: 'Message sent' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
