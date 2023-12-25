require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Require route modules
const coursesRoutes = require('./routes/coursesRoutes');
const forumRoutes = require('./routes/forumRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Make sure adminRoutes is a function that takes a router and adds routes to it
const adminRoutes = require('./routes/adminRoutes')(express.Router());

// Require middleware
const authMiddleware = require('./middlewares/authMiddleware');
const checkRole = require('./middlewares/roleMiddleware');


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/CodeWithLuke') // Adjust the database name as necessary
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to CodeWithLuke!');
});

app.use('/courses', coursesRoutes);
app.use('/forum', forumRoutes);
app.use('/challenges', challengeRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
