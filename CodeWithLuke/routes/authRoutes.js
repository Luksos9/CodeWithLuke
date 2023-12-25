const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation logic here: check if username and password are not empty.

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/register', async (req, res) => {
    try {
      // Validation logic here
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).send('Please enter all fields');
      }
  
      // Check for existing user
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).send('User already exists');
      }

      user = new User({
        username,
        password,
        role: req.body.role || 'user'
      });
  
      // Save user with hashed password
      await user.save();
  
      // Create token
      const payload = { user: { id: user.id } };
      jwt.sign(
        { user: { id: user.id, role: user.role } }, // Include the role here
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
  
module.exports = router;