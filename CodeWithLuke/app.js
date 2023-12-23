const express = require('express');
const app = express();
const coursesRoutes = require('./coursesRoutes');
const forumRoutes = require('./forumRoutes');
const challengeRoutes = require('./challengeRoutes');
const authRoutes = require('./authRoutes');

app.get('/', (req, res) => {
  res.send('Welcome to CodeWithLuke!');
});

app.use('/courses', coursesRoutes);
app.use('/forum', forumRoutes);
app.use('/challenges', challengeRoutes); // Add this line to use challengeRoutes
app.use('/auth', authRoutes); // Add this line to use authRoutes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
