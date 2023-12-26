const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

    // Add new fields for profile information
    bio: {
      type: String,
      required: false
    },
    website: {
      type: String,
      required: false
    },
    profilePicture: {
      type: String,
      required: false
    },

    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'moderator']
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'] // This regex checks for a valid email format
    },

    resetPasswordToken: {
      type: String,
      required: false
    },
    resetPasswordExpires: {
      type: Date,
      required: false
    }
  
});

// Pre-save hook to hash the password before saving
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);
