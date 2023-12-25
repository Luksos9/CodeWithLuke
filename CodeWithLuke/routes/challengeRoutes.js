const express = require('express');
const router = express.Router();

// Get a list of all coding challenges
router.get('/', (req, res) => {
  res.send('All coding challenges will be listed here.');
});

// Get a specific coding challenge by ID
router.get('/:id', (req, res) => {
  res.send(`Details of coding challenge with ID ${req.params.id}`);
});

// More routes can be added here for submitting solutions, rating challenges, etc.

module.exports = router;
