const isAuthorize = (req, res, next) => {
  try {
    const user = req.user;
    
    next();
  } catch (error) {
    console.error('Unauthorized, cannot access!', error);
    res.status(500).json({ message: 'Authorize error' });
  }
};

module.exports = { isAuthorize }; 