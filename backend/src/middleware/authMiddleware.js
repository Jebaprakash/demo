const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Debug: Log success
        // console.log(`Admin authenticated: ${decoded.username}`);

        // Add admin info to request
        req.adminId = decoded.id;
        req.username = decoded.username;

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

module.exports = authMiddleware;
