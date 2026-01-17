const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    items: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Order must contain items' }
        }
    },
    customer: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Customer details are required' }
        }
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: { args: [0], msg: 'Total amount cannot be negative' }
        }
    },
    paymentMethod: {
        type: DataTypes.ENUM('COD', 'QR', 'RAZORPAY'),
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.ENUM('Unpaid', 'PendingVerification', 'Paid'),
        allowNull: false,
        defaultValue: 'Unpaid'
    },
    orderStatus: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending'
    }
}, {
    tableName: 'orders',
    timestamps: true,
    indexes: [
        { fields: ['createdAt'] },
        { fields: ['orderStatus'] },
        { fields: ['paymentStatus'] }
    ]
});

module.exports = Order;
