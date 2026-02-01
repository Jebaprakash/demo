const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        if (decoded.role !== 'user') {
            return res.status(401).json({ success: false, message: 'Not authorized as user' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

module.exports = { userAuth };
