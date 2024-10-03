const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./database/db'); // Ensure this points to your correct DB config

// Express route
const libraryRoute = require('../backend/route/library.route');
const createError = require('http-errors'); // Use http-errors for creating errors

// Mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db)
    .then(() => {
        console.log('Database connection successful');
    })
    .catch(error => {
        console.error('Database connection failed:', error);
    });

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/library', libraryRoute);

// Set the port
const port = 3001;
app.listen(port, () => {
    console.log('Connected to port', port);
});

// Error handling for 404
app.use((req, res, next) => {
    next(createError(404)); // Fixed error handling for 404
});

// Error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500; // Default to 500 for server errors
    res.status(err.statusCode).send(err.message); // Fixed err.message typo
});
