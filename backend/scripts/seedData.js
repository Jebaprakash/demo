require('dotenv').config();
const { sequelize } = require('../src/config/database');
const Admin = require('../src/models/Admin');
const Product = require('../src/models/Product');

const seedData = async () => {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL');

        // Sync models (create tables)
        await sequelize.sync({ force: true }); // force: true will drop existing tables
        console.log('Database synchronized');

        // Create admin user
        console.log('Creating admin user...');
        await Admin.create({
            username: 'jeba',
            password: '12345678'
        });
        console.log('Admin created: username=jeba, password=12345678');

        // Create sample products
        console.log('Creating sample products...');

        const sampleProducts = [
            {
                name: 'Wireless Bluetooth Headphones',
                description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
                price: 2999,
                category: 'Electronics',
                images: ['/uploads/products/placeholder-headphones.jpg'],
                stockQty: 50,
                isActive: true
            },
            {
                name: 'Smart Fitness Watch',
                description: 'Track your fitness goals with this advanced smartwatch. Features heart rate monitoring, GPS, sleep tracking, and 7-day battery life.',
                price: 4499,
                category: 'Electronics',
                images: ['/uploads/products/placeholder-watch.jpg'],
                stockQty: 30,
                isActive: true
            },
            {
                name: 'Organic Cotton T-Shirt',
                description: 'Comfortable and eco-friendly t-shirt made from 100% organic cotton. Available in multiple colors and sizes.',
                price: 599,
                category: 'Clothing',
                images: ['/uploads/products/placeholder-tshirt.jpg'],
                stockQty: 100,
                isActive: true
            },
            {
                name: 'Leather Wallet',
                description: 'Genuine leather wallet with RFID protection. Multiple card slots and a sleek design that fits perfectly in your pocket.',
                price: 899,
                category: 'Accessories',
                images: ['/uploads/products/placeholder-wallet.jpg'],
                stockQty: 75,
                isActive: true
            },
            {
                name: 'Stainless Steel Water Bottle',
                description: 'Keep your drinks hot or cold for hours with this insulated stainless steel bottle. BPA-free and eco-friendly.',
                price: 799,
                category: 'Home & Kitchen',
                images: ['/uploads/products/placeholder-bottle.jpg'],
                stockQty: 60,
                isActive: true
            },
            {
                name: 'Yoga Mat Premium',
                description: 'Non-slip, eco-friendly yoga mat with extra cushioning. Perfect for yoga, pilates, and home workouts.',
                price: 1299,
                category: 'Sports',
                images: ['/uploads/products/placeholder-yogamat.jpg'],
                stockQty: 40,
                isActive: true
            },
            {
                name: 'Portable Phone Charger 20000mAh',
                description: 'High-capacity power bank with fast charging support. Charge multiple devices simultaneously.',
                price: 1499,
                category: 'Electronics',
                images: ['/uploads/products/placeholder-powerbank.jpg'],
                stockQty: 80,
                isActive: true
            },
            {
                name: 'Running Shoes',
                description: 'Lightweight and breathable running shoes with superior cushioning and support. Perfect for daily runs and marathons.',
                price: 3499,
                category: 'Footwear',
                images: ['/uploads/products/placeholder-shoes.jpg'],
                stockQty: 45,
                isActive: true
            },
            {
                name: 'Coffee Maker',
                description: 'Programmable coffee maker with 12-cup capacity. Wake up to fresh coffee every morning.',
                price: 2799,
                category: 'Home & Kitchen',
                images: ['/uploads/products/placeholder-coffeemaker.jpg'],
                stockQty: 25,
                isActive: true
            },
            {
                name: 'Backpack Laptop Bag',
                description: 'Durable laptop backpack with multiple compartments, USB charging port, and water-resistant material.',
                price: 1899,
                category: 'Accessories',
                images: ['/uploads/products/placeholder-backpack.jpg'],
                stockQty: 55,
                isActive: true
            }
        ];

        await Product.bulkCreate(sampleProducts);
        console.log(`Created ${sampleProducts.length} sample products`);

        console.log('\n✅ Seed data created successfully!');
        console.log('\nAdmin Credentials:');
        console.log('Username: jeba');
        console.log('Password: 12345678');
        console.log('\n⚠️  Please change the admin password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
