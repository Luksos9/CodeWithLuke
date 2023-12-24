const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const authMiddleware = require('./authMiddleware');

// Apply the middleware to the routes that require authentication
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Assuming the user ID is stored in req.user.id after successful auth
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    // Assuming the user ID is stored in req.user.id after successful auth
    let user = await User.findById(req.user.id);
    
    // Validation logic (if any fields are mandatory)
    const { bio, website, profilePicture } = req.body;
    if (!bio && !website && !profilePicture) {
      return res.status(400).send('Please include the fields to update');
    }

    // Update logic
    if (bio) user.bio = bio;
    if (website) user.website = website;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    const userToSend = { ...user._doc };
    delete userToSend.password; // Make sure to not send the password
    res.json(userToSend);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;