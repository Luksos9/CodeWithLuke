
  const express = require('express');
  // const router = express.Router();
  const User = require('../models/User');
  const authMiddleware = require('../middlewares/authMiddleware');
  const checkRole = require('../middlewares/roleMiddleware');
  
  module.exports = function (router) {
    // Use the middlewares and route handler
    router.put('/user/:id/role', [authMiddleware, checkRole(['admin'])], async (req, res) => {
      try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.json(user);
      } catch (err) {
        res.status(500).send('Server error');
      }
    });
  
    return router;
  };