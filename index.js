const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Connect to MongoDB using the environment variable
const mongoURI = process.env.MONGODB_URI || 'your-default-mongodb-uri-here';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
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

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables for security
        pass: process.env.EMAIL_PASS  // Use environment variables for security
    }
});

// Routes
app.post('/src/pages/thankyou.html', (req, res) => {
    console.log('Received registration data:', req.body);

    const registration = new Registration(req.body);
    registration.save((err, registration) => {
        if (err) {
            console.error('Error saving registration:', err);
            return res.status(500).json({ message: 'Registration failed', error: err });
        }
        console.log('Registration successful:', registration);

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Use environment variables for security
            to: registration.email,
            subject: 'Registration Successful',
            text: `Dear ${registration.name},\n\nThank you for registering. Your registration was successful!\n\nBest regards,\nEvent Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Registration successful, but email failed', error });
            }
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'Registration successful', registration });
        });
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
