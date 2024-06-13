const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('your-mongodb-connection-string', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
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
        if (err) return res.status(500).send(err);
        return res.status(200).send('Registration successful');
    });
});

app.post('/contact', (req, res) => {
    // Handle contact form data here
    console.log(req.body);
    res.json({ message: 'Message sent' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
