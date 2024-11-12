const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    // Get token from the Authorization header and remove "Bearer " prefix if present
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the secret key from the .env file
        const decoded = jwt.verify(token, process.env.AUTH);
        
        // Attach decoded user info to the request object (e.g., userId, username)
        req.user = decoded;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
    if (req.user.username !== 'admin') {
        return res.status(403).json({ message: 'Quyền truy cập bị từ chối. Bạn cần quyền admin.' });
    }
    next();
};

module.exports = {authenticateToken, isAdmin};
