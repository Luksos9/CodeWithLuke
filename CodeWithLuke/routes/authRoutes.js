const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Utility function to generate a password reset token
function generateToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Utility function to send password reset email
async function sendResetEmail(userEmail, link) {
  let transporter = nodemailer.createTransport({
    service: 'wp.pl', // Replace with your email service
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  let mailOptions = {
    from: '"Your App Name" CodeWithLuke',
    to: userEmail,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
           ${link}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.`
  };

  await transporter.sendMail(mailOptions);
}

// Password reset route
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('User with given email does not exist.');
    }

    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:30000.com/reset-password/${token}`;
    await sendResetEmail(user.email, resetLink);

    res.send('Password reset email sent.');
  } catch (error) {
    res.status(500).send('Server error');
  }
});


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
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        return res.status(400).send('Please enter all required fields');
      }

      // Check for existing user by email as well as username
      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
        return res.status(400).send('User already exists with that email or username');
      }

      user = new User({
        username,
        email,
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

  router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const token = generateToken(); // A function you would create to generate a random token
    const expirationTime = Date.now() + 3600000; // 1 hour from now
  
    await User.findOneAndUpdate({ email }, {
      resetPasswordToken: token,
      resetPasswordExpires: expirationTime
    });
  
    const resetLink = `http://yourapp.com/reset-password/${token}`;
    await sendResetEmail(email, resetLink); // A function to send email
    res.send('Password reset email sent.');
  });
  
module.exports = router;