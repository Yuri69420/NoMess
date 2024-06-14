const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the thank you page
app.get('/thankyou', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'src', 'pages', 'thankyou.html'));
});

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

        // Send a response to the client
        res.status(200).json({ message: 'Registration successful' });
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
