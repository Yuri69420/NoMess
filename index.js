const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Connect to MongoDB using the environment variable
const mongoURI = process.env.MONGODB_URI || 'your-default-mongodb-uri-here';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

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
    const registration = new Registration(req.body);
    registration.save((err, registration) => {
        if (err) return res.status(500).json({ message: 'Registration failed', error: err });
        return res.status(200).json({ message: 'Registration successful', registration });
    });
});

app.post('/contact', (req, res) => {
    console.log(req.body);
    res.json({ message: 'Message sent' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
