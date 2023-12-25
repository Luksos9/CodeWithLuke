// This middleware will now simply export the function that checks if the user has the role 'admin'
const roleCheckMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).send('Insufficient permissions to assign roles.');
    }
  };
  
  module.exports = roleCheckMiddleware;
  