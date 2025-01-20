const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied - No token provided' });
    }

   const user = jwt.verify(token, process.env.JWT_SECRET);
      if (!user) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      
      req.user = user;
      next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
}

module.exports = { authenticateToken }; 