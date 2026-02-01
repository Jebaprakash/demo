const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { userAuth: auth } = require('../middleware/userAuth');

// Generate JWT Tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: 'user' },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
        { id: user.id, email: user.email, role: 'user' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 */
router.post('/register', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { firstName, lastName, email, password, phone } = req.body;

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        user = await User.create({
            firstName,
            lastName,
            email,
            password,
            phone
        });

        const { accessToken, refreshToken } = generateTokens(user);

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 */
router.post('/login', [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 */
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 */
router.put('/profile', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { firstName, lastName, phone, address } = req.body;

        await user.update({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            phone: phone || user.phone,
            address: address || user.address
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
