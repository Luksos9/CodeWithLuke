const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('List of all courses will be here.');
});

router.get('/:id', (req, res) => {
  res.send(`Details of course with ID ${req.params.id}`);
});

module.exports = router;
