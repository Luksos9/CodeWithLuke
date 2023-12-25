const checkRole = (roles) => (req, res, next) => {
    console.log("checkRole: Checking roles:", roles);
    console.log("checkRole: User data:", req.user);
    if (!req.user) {
        console.log("checkRole: No user found in request.");
      return res.status(401).send('Not authenticated');
    }
  
    const hasRole = roles.includes(req.user.role);
    console.log("checkRole: User has correct role:", hasRole);
    if (!hasRole) {
        console.log("checkRole: User does not have the right role. Required:", roles, "Found:", req.user.role);
      return res.status(403).send('You do not have the right role');
    }
  
    next();
  };
  
  module.exports = checkRole;
  