const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5500;
const MONGODB_URI = 'mongodb://localhost/taskmanagement';

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use(express.static('public'));

module.exports = app;
