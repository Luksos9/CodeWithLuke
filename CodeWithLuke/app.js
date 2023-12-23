require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Require route modules
const coursesRoutes = require('./coursesRoutes');
const forumRoutes = require('./forumRoutes');
const challengeRoutes = require('./challengeRoutes');
const authRoutes = require('./authRoutes');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/CodeWithLuke', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
