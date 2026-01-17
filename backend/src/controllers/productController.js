const Product = require('../models/Product');
const { Op } = require('sequelize');

// Get all products with search, filter, and sort
const getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sort } = req.query;

        let where = { isActive: true };

        // Search by name or description
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filter by category
        if (category) {
            where.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
        }

        // Determine sort order
        let order = [];
        switch (sort) {
            case 'price-low':
                order = [['price', 'ASC']];
                break;
            case 'price-high':
                order = [['price', 'DESC']];
                break;
            case 'newest':
                order = [['createdAt', 'DESC']];
                break;
            default:
                order = [['createdAt', 'DESC']];
        }

        const products = await Product.findAll({ where, order });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: [[Product.sequelize.fn('DISTINCT', Product.sequelize.col('category')), 'category']],
            where: { isActive: true },
            raw: true
        });

        const categories = products.map(p => p.category);

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getCategories
};
