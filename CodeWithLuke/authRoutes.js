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
        password
      });
  
      // Save user with hashed password
      await user.save();
  
      // Create token
      const payload = { user: { id: user.id } };
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
  